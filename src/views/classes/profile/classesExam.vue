<template>
  <div>
    <el-table :data="examList" style="width: 100%" v-loading="loading">
      <el-table-column prop="examName" label="作业名称"> </el-table-column>
      <el-table-column label="完成时间" align="center">
        <template slot-scope="scope"
          >{{ scope.row.startDate }} 至 {{ scope.row.deadline }}</template
        >
      </el-table-column>
      <el-table-column label="答题时间" align="center">
        <template slot-scope="scope">{{ scope.row.time }} 分钟</template>
      </el-table-column>
      <el-table-column label="总分" align="center">
        <template slot-scope="scope">{{ scope.row.totalScore }} 分</template>
      </el-table-column>
      <el-table-column prop="grade" label="分数" width="150" v-if="$hasRole('学生')"> </el-table-column>
      <el-table-column
        label="是否公布答案"
        align="center"
        v-if="$hasRole('教师')"
      >
        <template slot-scope="scope">{{
          scope.row.publishAnswer == 1 ? "是" : "否"
        }}</template>
      </el-table-column>
      <el-table-column
        label="是否公布分数"
        align="center"
        v-if="$hasRole('教师')"
      >
        <template slot-scope="scope">{{
          scope.row.publishScore == 1 ? "是" : "否"
        }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80"> </el-table-column>
      <el-table-column
        prop="operate"
        label="操作"
        align="center"
        :width="$hasRole('教师') ? '300' : '150'"
      >
        <template slot-scope="scope">
          <div v-if="$hasRole('教师')">
            <el-button
              type="primary"
              size="mini"
              @click="toExamSituation(scope.row)"
              plain
              >查看完成情况</el-button
            >
            <el-button
              type="info"
              size="mini"
              @click="handleUpdate(scope.row)"
              plain
              >设置</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="cancelRelease(scope.row)"
              plain
              >取消发布</el-button
            >
          </div>
          <div v-if="$hasRole('学生')">
            <el-button
              type="primary"
              size="small"
              v-if="scope.row.status != '未开始'"
              @click="openTestPaper(scope.row)"
              plain
            >
              {{ scope.row.status == "进行中" ? "开始" : "" }}
              {{ scope.row.status == "已结束" ? "查看" : "" }}
              {{ scope.row.status == "答题完毕" ? "查看" : "" }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getExamList"
    />

    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form label-width="80px">
        <el-form-item>
          <el-date-picker
            v-model="releaseExamDate"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-switch
            v-model="examForm.publishAnswer"
            active-text="公布答案"
            :active-value="1"
            inactive-text="不公布答案"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item>
          <el-switch
            v-model="examForm.publishScore"
            active-text="公布分数"
            :active-value="1"
            inactive-text="不公布分数"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getFormatDate } from "@/utils/common";
import { listClassesExam } from "@/api/exam";
import { updateRelease, cancelRelease } from "@/api/releaseExam";

export default {
  props: {
    classesId: undefined,
  },

  data() {
    return {
      loading: false,
      total: 0,

      open: false,

      title: "",

      examForm: {},
      releaseExamDate: "",

      examList: null,

      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },

  created() {
    this.getExamList();
  },

  methods: {
    getExamList() {
      this.loading = true;
      const classesId = this.classesId;
      listClassesExam(this.queryParams, classesId).then((response) => {
        this.examList = response.rows;
        this.handleExamData();
        this.total = response.total;
        this.loading = false;
      });
    },

    openTestPaper(row) {
      this.$router.push({
        path: "/exam/start",
        query: { classesId: this.classesId, examId: row.examId },
      });
    },

    toExamSituation(row) {
      this.$router.push({
        path: "/exam/situation",
        query: { classesId: this.classesId, examId: row.examId },
      });
    },

    handleExamData() {
      this.examList.forEach((exam) => {
        if (exam.examStatus == 1) {
          if (exam.publishScore == 1) {
            exam.grade += "分";
          } else {
            exam.grade = "--";
          }

          exam.status = "答题完毕";
        } else {
          exam.status = "进行中";
          exam.grade = "--";
        }

        var nowDate = new Date().getTime();
        var deadlineTime = new Date(exam.deadline).getTime();
        var startDateTime = new Date(exam.startDate).getTime();
        if (nowDate > deadlineTime) {
          exam.status = "已结束";
        }
        if (nowDate < startDateTime) {
          exam.status = "未开始";
        }
      });
    },

    handleUpdate(row) {
      this.examForm = row;
      this.title = "设置发布";
      this.open = true;
    },

    cancel() {
      this.examForm = {};
      this.releaseExamDate = "";
      this.open = false;
    },

    submitForm() {
     
      let request = {
        examId: this.examForm.examId,
        classesId: this.examForm.classesId,
        startDate: getFormatDate(new Date(this.releaseExamDate[0])),
        deadline: getFormatDate(new Date(this.releaseExamDate[1])),
        publishScore: this.examForm.publishScore,
        publishAnswer: this.examForm.publishAnswer,
      };
      updateRelease(request).then((res) => {
        this.msgSuccess("修改成功");
        this.cancel()
        this.getExamList()
      });
    },

    cancelRelease(row) {
      cancelRelease(this.classesId, row.examId).then((res) => {
        this.msgSuccess("取消发布成功");
        this.getExamList()
      });
    },
  },
};
</script>

<style lang='scss' scoped>
</style>
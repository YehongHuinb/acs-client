<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="70%"
      class="releaseExam"
      @close="closeReleaseDialog"
    >
      <el-steps :active="releaseSteps" finish-status="success" align-center>
        <el-step title="选择班级"></el-step>
        <el-step title="选择时间"></el-step>
        <el-step title="发布作业"></el-step>
      </el-steps>

      <!-- 选择班级 -->
      <div v-if="releaseSteps == 0">
        <el-table
          ref="multipleTable"
          :data="classesList"
          height="350"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="班级编号" width="120">
            <template slot-scope="scope">{{ scope.row.classesId }} </template>
          </el-table-column>
          <el-table-column prop="classesName" label="班级名称" />
          <el-table-column prop="date" label="考试时间" width="350" />
          <el-table-column prop="status" label="状态" width="150" />
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getClassesList"
        />
      </div>

      <!-- 选择考试时间 -->
      <div v-if="releaseSteps == 1" style="margin-left:32% ; margin-top:2%">
        <el-date-picker
          v-model="releaseDate"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <el-switch
          v-model="examClasses.publishAnswer"
          active-text="公布答案"
          :active-value="1"
          inactive-text="不公布答案"
          :inactive-value="0"
          style="margin-left:15%"
        />
        <el-switch
          v-model="examClasses.publishScore"
          active-text="公布分数"
          :active-value="1"
          inactive-text="不公布分数"
          :inactive-value="0"
          style="margin-left:15%"
        />
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="lastStep()">
          {{ releaseSteps == 1 ? "上一步" : "取消" }}
        </el-button>
        <el-button type="info" v-if="releaseSteps == 0" size="medium">
          取消发布
        </el-button>
        <el-button type="primary" @click="nestStep()" size="medium">
          {{ releaseSteps == 0 ? "下一步" : "发布" }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { releaseExam } from "@/api/releaseExam";
import { listClasses } from "@/api/classes";
import { getFormatDate } from "@/utils/common";

export default {
  name: "ResleseExam",

  data() {
    return {
      open: false,

      title: "",

      classesList: [],

      //发布试卷记录
      testPaper_classes: [],

      releaseDate: "",

      examClasses: {
        examId: undefined,
        releaseDate: undefined,
        startDate: undefined,
        deadline: undefined,
        publishAnswer: 0,
        publishScore: 0,
        ids: [],
      },

      //发布考试步骤状态
      releaseSteps: 0,
      total: 0,

      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },

  methods: {
    show(examId, examName) {
      this.examClasses.examId = examId;
      this.title = examName;
      this.open = true;
      this.getClassesList();
    },

    getClassesList() {
      listClasses(this.queryParams).then((response) => {
        this.classesList = response.rows;
        this.total = response.total;
      });
    },

    handleSelectionChange(selection) {
      this.examClasses.ids = selection.map((item) => item.classesId);
    },

    lastStep() {
      this.releaseSteps == 1 ? (this.releaseSteps = 0) : (this.open = false);

    },

    nestStep() {
      //判断是否有选择班级
      if (this.examClasses.ids.length == 0) {
        this.$message("请选择班级");
        return;
      }

      //下一步 ---选择时间
      if (this.releaseSteps == 0) {
        this.releaseSteps++;
        return;
      }
      //判断是否有选择考试时间
      if (this.releaseDate == "" || this.releaseDate.length != 2) {
        this.$message("请选择考试时间");
        return;
      }

      this.doRelease()
    },

    doRelease() {
      this.examClasses.startDate = getFormatDate(
        new Date(this.releaseDate[0])
      );
      this.examClasses.deadline = getFormatDate(
        new Date(this.releaseDate[1])
      );

      releaseExam(this.examClasses).then((res) => {
        this.$message.success("发布成功");
        this.closeReleaseDialog()
      });
    },

    closeReleaseDialog() {
      //初始化数据
      this.open = false;
      this.releaseDate = "";
      this.releaseTestSteps = 0;
      this.examClasses = {
        examId: undefined,
        releaseDate: undefined,
        startDate: undefined,
        deadline: undefined,
        publishAnswer: 0,
        publishScore: 0,
        ids: [],
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.releaseExam .el-dialog .pagination {
  text-align: center;
  margin-top: 6px;
}
.releaseExam .el-dialog .el-date-editor {
  margin: 0;
  margin-top: 24px;
}
.el-dialog__body {
  text-align: center;
}
.el-dialog__body .el-switch {
  display: block;
  margin: 24px 0;
}

.el-divider--horizontal {
  background-color: #444;
  margin: 14px 0s;
}
</style>
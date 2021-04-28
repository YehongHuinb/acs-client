<template>
  <div class="app-container">
    <!-- 其他班级成员表格 -->
    <div class="user_list table">
      <el-table :data="userGradeList" style="width: 100%">
        <el-table-column label="用户id">
          <template slot-scope="scope">{{ scope.row.userId }} </template>
        </el-table-column>
        <el-table-column prop="userName" label="成员名称"></el-table-column>
        <el-table-column prop="answerDate" label="答题日期" width="184">
        </el-table-column>
        <el-table-column prop="answerTime" label="答题用时">
          <template slot-scope="scope"
            >{{ scope.row.answerTime | formatSeconds }}
          </template>
        </el-table-column>
        <el-table-column label="答题状态">
          <template slot-scope="scope"
            >{{ scope.row.examStatus == 1 ? "已完成" : "未完成" }}
          </template>
        </el-table-column>
        <el-table-column prop="grade" label="得分"> </el-table-column>
        <el-table-column prop="gradeAuto" label="自动评改得分">
        </el-table-column>
        <el-table-column label="批改状态">
          <template slot-scope="scope"
            >{{ scope.row.markStatus == 1 ? "批改完成" : "待批改" }}
          </template>
        </el-table-column>
        <el-table-column prop="operate" label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              v-if="scope.row.examStatus == 1"
              @click="openPaper(scope.row)"
              plain
            >
              {{ scope.row.markStatus == 1 ? "查看试卷" : "审批试卷" }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getUserGradeList"
      />
    </div>
  </div>
</template>

<script>
import { listUserGrade } from "@/api/userGrade";
import { formatSeconds } from '@/utils/common'

export default {
  name: "ExamSituation",
  data() {
    return {
      classesId: this.$route.query.classesId,
      examId: this.$route.query.examId,
      userGradeList: [],
      releaseInfo: {},

      total: 0,
      loading: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    this.getUserGradeList();
  },
  methods: {
    getUserGradeList() {
      this.loading = true;
      listUserGrade(this.queryParams, this.classesId, this.examId).then(
        (response) => {
          console.log(this.queryParams);
          this.userGradeList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },

    openPaper(row) {
     this.$router.push({ path: '/exam/mark', query: {classesId: this.classesId, examId: this.examId, userId: row.userId }})
    },
  },
};
</script>

<style lang="scss">
.testSituation {
  padding: 24px;

  .el-breadcrumb {
    font-size: 16px;
    padding: 0 16px 16px 16px;
  }
}
</style>
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="20" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="作业名称" prop="examName">
            <el-input
              v-model="queryParams.examName"
              placeholder="请输入试卷名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
            >
              搜索
            </el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >
              创建作业
            </el-button>
          </el-col>
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getExamList"
            :columns="columns"
          ></right-toolbar>
        </el-row>

        <el-table
          v-loading="loading"
          :data="examList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            label="作业编号"
            align="center"
            key="examId"
            prop="examId"
            v-if="columns[0].visible"
          />
          <el-table-column
            label="作业名称"
            align="center"
            key="examName"
            prop="examName"
            v-if="columns[1].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="答题时间"
            align="center"
            key="time"
            prop="time"
            v-if="columns[2].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="题目数量"
            align="center"
            key="topicNum"
            prop="topicNum"
            v-if="columns[3].visible"
            width="120"
          />
          <el-table-column
            label="及格分数"
            align="center"
            key="passMark"
            prop="passMark"
            v-if="columns[4].visible"
            width="120"
          />
          <el-table-column
            label="满分分数"
            align="center"
            key="totalScore"
            prop="totalScore"
            v-if="columns[5].visible"
            width="120"
          />
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleReslese(scope.row)"
              >
                发布
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleUpdate(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-key"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
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
      </el-col>
    </el-row>

    <RealeseExam ref="resleseExamDialog"/>
  </div>
</template>

<script>
import { listExam, deleteExam } from "@/api/exam";

import RealeseExam from './component/ResleseExam'

export default {
  components: {
    RealeseExam
  },

  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,

      // 用户表格数据
      examList: null,

      queryParams: {
        pageNum: 1,
        pageSize: 10,
        examrName: undefined,
        creatorName: undefined,
      },

      columns: [
        { key: 0, label: `试卷编号`, visible: true },
        { key: 1, label: `试卷名称`, visible: true },
        { key: 2, label: `答题时间`, visible: true },
        { key: 3, label: `题目数量`, visible: true },
        { key: 4, label: `及格分数`, visible: true },
        { key: 5, label: `满分分数`, visible: true },
      ],
    };
  },

  created() {
    this.getExamList();
  },

  methods: {
    getExamList() {
      this.loading = true;
      listExam(this.queryParams).then((response) => {
        this.examList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    handleQuery() {
      this.queryParams.page = 1;
      this.getExamList();
    },

    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.examId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    handleAdd() {
      this.$router.push({ path: "/exam/profile" });
    },

    handleReslese(row) {
      this.$refs.resleseExamDialog.show(row.examId, row.examName);
    },


    handleUpdate(row) {
      this.$router.push({ path: "/exam/profile", query: { id: row.examId } });
    },

    handleDelete(row) {
      this.$confirm(
        '是否确认删除试卷编号为"' + row.examId + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return deleteExam(row.examId);
        })
        .then(() => {
          this.getExamList();
          this.msgSuccess("删除成功");
        });
    }

  },
};
</script>

<style lang='scss' scoped>
</style>
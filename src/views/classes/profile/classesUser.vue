<template>
  <div>
    <el-table
      v-loading="loading"
      :data="userList"
    >
      <el-table-column
        label="用户昵称"
        align="center"
        key="nickName"
        prop="nickName"
      />
      <el-table-column
        label="用户性别"
        align="center"
        key="sex"
        prop="sex"
      />
      <el-table-column
        label="手机号码"
        align="center"
        key="phoneNumber"
        prop="phoneNumber"
      />
       <el-table-column label="身份">
          <div slot-scope="scope" v-if="scope.row.userId!=classes.creatorId">学生</div>
          <div slot-scope="scope" v-else-if="scope.row.userId==classes.creatorId">管理员</div>
        </el-table-column>
      <el-table-column
        v-if="$hasRole('教师')"
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope" >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handledelete(scope.row)"
            v-if="scope.row.userId != classes.creatorId"
          >
            踢出班级
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getClassesUserList"
    />
  </div>
</template>

<script>

import { listClassesUser, deleteClassesUser,getClassesInfo } from '@/api/classes'

export default {
  props: {
    classesId: undefined
  },

  data() {
    return {

      loading: true,
      classes:{},

      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,

      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },

  created() {
    this.getClassesUserList()
    this.getClassesInfo()
  },

  methods: {
    getClassesUserList() {
       this.loading = true;
       const classesId = this.classesId
      listClassesUser(this.queryParams,classesId).then(response => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      })
    },

    getClassesInfo(){
      const classesId = this.classesId
      getClassesInfo(classesId).then(res =>{
        this.classes = res.data;
      })
    },

    handledelete(row) {
      const classesId = this.classesId
      const userId = row.userId
      this.$confirm(
        '是否确认将"' + row.nickName + '"踢出班级?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return deleteClassesUser(classesId,userId);
        })
        .then(() => {
          this.getClassesUserList()
          this.msgSuccess("删除成功");
        });
    }
  },
};
</script>

<style lang='scss' scoped>
</style>
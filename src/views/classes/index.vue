<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="20" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="班级名称" prop="classesName">
            <el-input
              v-model="queryParams.classesName"
              placeholder="请输入班级名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="创建者" prop="creatorName">
            <el-input
              v-model="queryParams.creatorName"
              placeholder="请输入创建者名称"
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

        <div v-if="$hasRole('教师')">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
              >
                创建班级
              </el-button>
            </el-col>
          </el-row>
        </div>
        <div v-else>
          <el-row :gutter="20" class="mb8">
            <el-col :span="6">
              <el-input
                size="small"
                placeholder="请输入班级编号"
                v-model="classesId"
                clearable
              >
              <el-button slot="append" icon="el-icon-plus" @click="joinClasses">加入班级</el-button>
              </el-input>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-if="classesList.length > 0">
      <el-col :span="8" v-for="item in classesList" :key="item.id">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ item.classesName }}</span>
            <el-dropdown trigger="click" style="float:right">
              <el-button icon="el-icon-caret-bottom" type="text"/>
              <el-dropdown-menu slot="dropdown">
                <router-link
                  :to="{
                    path: '/classes/profile',
                    query: { id: item.classesId },
                  }"
                >
                  <el-dropdown-item>进入班级</el-dropdown-item>
                </router-link>
                <el-dropdown-item
                  v-if="$hasRole('教师')"
                  divided
                  @click.native="handleUpdate(item)"
                >
                  <span>设置班级</span>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="$hasRole('教师')"
                  divided
                  @click.native="handleDelete(item)"
                >
                  <span>删除班级</span>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="$hasRole('学生')"
                  divided
                  @click.native="handleDeleteUser(item)"
                >
                  <span>退出班级</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div>
            <el-row >
              <el-col v-if="$hasRole('教师')">班级编号:&nbsp;{{item.classesId}}</el-col>            
            </el-row>
            <el-row style="margin-top:3%">
              <el-col>创建者:&nbsp;{{item.creatorName}} </el-col>
            </el-row>
            <el-row style="margin-top:3%">
              <el-col>班级人数:&nbsp;{{item.peopleNum}}</el-col>
            </el-row>
            <el-row style="margin-top:3%">
              <el-col>班级简介:&nbsp;{{item.introduction}}</el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row v-else> 你还没有任何班级 </el-row>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getClassesList"
    />

    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item
              v-if="form.classesId == undefined"
              label="班级名称"
              prop="classesName"
            >
              <el-input
                v-model="form.classesName"
                placeholder="请输入班级名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="班级简介" prop="introduction">
              <el-input
                v-model="form.introduction"
                placeholder="请输入班级简介"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";
import {
  listClasses,
  addClasses,
  updateClasses,
  deleteClasses,
  quitClasses,
  addClassesUser,
} from "@/api/classes";

export default {
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",

      total: 0,

      classesId: undefined,

      classesList: [],

      queryParams: {
        pageNum: 1,
        pageSize: 10,
        classesName: undefined,
        creatorName: undefined,
      },

      form: {},

      rules: {
        classesName: [
          { required: true, message: "班级名称不能为空", trigger: "blur" },
        ],
        introduction: [
          { required: true, message: "班级简介不能为空", trigger: "blur" },
        ],
      },
    };
  },

  created() {
    this.getClassesList();
  },

  methods: {

    getClassesList() {
      this.loading = true;
      listClasses(this.queryParams).then((response) => {
        this.classesList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    cancel() {
      this.open = false;
      this.reset();
    },

    reset() {
      this.form = {
        classesId: undefined,
        classesName: undefined,
        creatorId: undefined,
        creatorName: undefined,
        introduction: undefined,
        people_num: undefined,
      };
      this.resetForm("form");
    },

    handleQuery() {
      this.getClassesList();
    },

    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    joinClasses() {
      addClassesUser(this.classesId).then(() => {
        this.msgSuccess("加入班级成功");
        this.getClassesList();
      })
    },

    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "创建班级";
    },

    handleUpdate(classes) {
      this.reset();
      this.form = classes;
      this.open = true;
      this.title = "设置班级";
    },

    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.classesId != undefined) {
            updateClasses(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getClassesList();
            });
          } else {
            addClasses(this.form).then((response) => {
              this.msgSuccess("创建成功");
              this.open = false;
              this.getClassesList();
            });
          }
        }
      });
    },

    handleDelete(classes) {
      const classesId = classes.classesId;
      this.$confirm(
        '是否确认删除班级名称为"' + classes.classesName + '"班级?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return deleteClasses(classesId);
        })
        .then(() => {
          this.getClassesList();
          this.msgSuccess("删除班级成功");
        });
    },

    handleDeleteUser(classes) {
      const classesId = classes.classesId;
      this.$confirm(
        '是否确认退出班级名称为"' + classes.classesName + '"班级?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return quitClasses(classesId);
        })
        .then(() => {
          this.getClassesList();
          this.msgSuccess("退出班级成功");
        });
    },
  },
};
</script>

<style lang='scss' scoped>
</style>
<template>
  <div class="app-container">
    <div>
      <el-row>
        <el-col>
          <span>班级名称：{{classes.classesName}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <span>班级简介：{{classes.introduction}}</span>
        </el-col>
      </el-row>
      
    </div>
    <div>
      <el-tabs>
        <el-tab-pane label="班级成员">
          <classes-user :classesId="classesId" />
        </el-tab-pane>
        <el-tab-pane label="班级作业">
          <classes-exam :classesId="classesId" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import classesUser from "./classesUser";
import classesExam from "./classesExam";

import { getClassesInfo } from '@/api/classes'
export default {
  components: {
    classesUser,
    classesExam
  },

  data() {
    return {
      classesId: this.$route.query.id,
      classes: {}
    };
  },

  created() {
    this.getClasses()
  },

  methods: {
    getClasses() {
      getClassesInfo(this.classesId).then( res => {
        this.classes = res.data
      })
    }
  },
};
</script>

<style lang='scss' scoped>
</style>
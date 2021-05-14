<template>
  <div class="createTest testPaper">
    <div class="w">
      <!-- 考试信息 -->
      <div class="title">
        <!-- {{testData}} -->
        <h3 class="testName">{{ testData.examName }}</h3>
        <ul>
          <li class="test-info">出卷者: {{ testData.creatorName }}</li>
          <li class="test-info">答题时间: {{ testData.time }} 分钟</li>
          <li class="test-info">截至时间: {{ testData.deadline }}</li>
          <li class="test-info">题目数量: 共 {{ testData.topicNum }} 道</li>
          <li class="test-info">总分: {{ testData.totalScore }} 分</li>
        </ul>

        <ul>
          <li class="user-info">答题人: {{ userName }}</li>
          <li
            class="user-info"
            v-if="
              finishTest &&
              testData.publishScore == 1 &&
              testData.userGrade.grade
            "
          >
            得分: {{ testData.userGrade.grade + "分" }}
          </li>
          <li class="user-info" v-else>剩余时间: {{ remainTime }}</li>

          <li class="fr" >
            <el-button
              type="primary"
              size="mini"
              @click="submitTestpaper"
              :disabled="isRead"
              >提交</el-button
            >
          </li>
        </ul>
      </div>

      <div class="title fixed" v-if="isFixed">
        <ul>
          <li class="test-info">
            <strong class="testName">{{ testData.examName }}</strong>
          </li>
          <li class="test-info">答题时间: {{ testData.time }} 分钟</li>
          <li class="test-info">截至时间: {{ testData.deadline }}</li>
          <li class="test-info" v-if="finishTest && testData.publishScore == 1">
            得分: {{ testData.grade + "分" }}
          </li>
          <li class="test-info" v-else>剩余时间: {{ remainTime }}</li>
          <li class="fr">
            <el-button
              type="primary"
              size="mini"
              @click="submitTestpaper"
              :disabled="isRead"
              >提交</el-button
            >
          </li>
        </ul>
      </div>
      <div
        class="test-content"
        :class="testData.publishAnswer == 1 ? 'publishScore' : ''"
      >
        <!-- 题目内容 -->
        <div class="topics">
          <div
            class="topic"
            v-for="(topics, index) in sortedTopics"
            :key="index"
          >
            <div class="topicsType" v-if="topics.topic_content.length != 0">
              <h4>{{ bigQuestionName_mixin(topics.topicType, index) }}</h4>
              <!-- 题目类型名称 -->

              <div
                class="topic-content"
                v-for="(t, index) in topics.topic_content"
                :key="index"
              >
                <div class="_location"></div>
                <!-- 题目 -->
                <div class="question" :class="forbid_copy ? 'forbid_copy' : ''">
                  <span class="question_nunber"
                    >{{ topicNavIndex_mixin(topics.topicType, index) }}、</span
                  >
                  {{ t.question }}
                  <span class="score">({{ t.score }}分)</span>
                </div>

                <!-- 单选题 -->
                <div class="radio" v-if="t.topicType == 0">
                  <el-radio
                    v-for="(item, index) in t.choice"
                    :key="index"
                    v-model="t.userAnswer"
                    :class="isCheckboxCorrect(t, item)"
                    :label="item"
                    :disabled="isRead"
                  >
                    {{ String.fromCharCode(65 + index) }}、{{ item }}
                  </el-radio>
                </div>

                <!-- 多选题 -->
                <div class="checkbox" v-if="t.topicType == 1">
                  <el-checkbox-group v-model="t.userAnswer">
                    <el-checkbox
                      :label="item"
                      v-for="(item, index) in t.choice"
                      :key="index"
                      :disabled="isRead"
                      :class="isCheckboxCorrect(t, item)"
                    >
                      {{ String.fromCharCode(65 + index) }}、{{ item }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>

                <!-- 判断题 -->
                <div class="TrueOrFalse" v-if="t.topicType == 2">
                  <el-radio
                    v-model="t.userAnswer"
                    label="true"
                    :disabled="isRead"
                    :class="isCheckboxCorrect(t, 'true')"
                    >正确</el-radio
                  >
                  <el-radio
                    v-model="t.userAnswer"
                    label="false"
                    :disabled="isRead"
                    :class="isCheckboxCorrect(t, 'false')"
                    >错误</el-radio
                  >
                </div>

                <!-- 填空题 -->
                <div class="fillInBlank" v-if="t.topicType == 3">
                  <div
                    v-for="(q, index) in fillSymbolStr(t.question)"
                    :key="index"
                  >
                    <el-input
                      type="textarea"
                      autosize
                      :disabled="isRead"
                      v-if="index != fillSymbolStr(t.question).length - 1"
                      v-model="t.userAnswer[index]"
                    >
                    </el-input>
                  </div>
                </div>

                <!-- 简答题 -->
                <div class="text" v-if="t.topicType == 4">
                  <el-input
                    type="textarea"
                    v-model="t.userAnswer"
                    :autosize="{ minRows: 3, maxRows: 10 }"
                    :disabled="isRead"
                  >
                  </el-input>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 题目导航 -->
        <div
          class="topic-nav"
          :class="isFixed ? 'isFixed' : ''"
          :style="topic_nav_style"
        >
          <div
            class="topic-nav-describe"
            v-if="finishTest && testData.publishAnswer == 1"
          >
            <span class="topic-nav-but correct"> </span> 正确
            <span class="space"></span>
            <span class="topic-nav-but error"> </span> 错误
          </div>
          <div class="topic-nav-describe" v-else>
            <span class="topic-nav-but hasAnswer"> </span> 已答
            <span class="space"></span>
            <span class="topic-nav-but"> </span> 未答
          </div>

          <div
            v-for="(topics, Topics_index) in sortedTopics"
            :key="Topics_index"
          >
            <div class="topic-nav-item" v-if="topics.topic_content.length != 0">
              <div class="nav-title">
                {{ topicTypeName_mixin(topics.topicType) }}
              </div>
              <span
                class="topic-nav-button"
                @click="topicNav(topics.topicType, index)"
                v-for="(item, index) in topics.topic_content"
                :key="index"
                :class="emptyAnswer(item)"
              >
                {{ topicNavIndex_mixin(topics.topicType, index) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="back-top" @click="backTop_mixin()">
        <i class="el-icon-arrow-up"></i>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import "@/assets/styles/test-paper.scss";
import examProfile from "@/mixins/examProfile-mixins";
import { getClassesExam, submitExam } from "@/api/exam";

export default {
  mixins: [examProfile],
  data() {
    return {
      userName: store.getters.name,
      classesId: this.$route.query.classesId,
      examId: this.$route.query.examId,

      //按题目类型分类好的题目数据
      //题目类型==>  0:单选题  1:多选题  2:判断题  3:填空题  4:简答题
      sortedTopics: [
        { topicType: 0, topic_content: [] },
        { topicType: 1, topic_content: [] },
        { topicType: 2, topic_content: [] },
        { topicType: 3, topic_content: [] },
        { topicType: 4, topic_content: [] },
      ],
      //试卷数据
      testData: {
        userGrade: {},
      },

      examClassesData: {},

      remainTime: "00:00:00", //考试剩余时间
      expendTime: 0, //考试用时(秒)
      isRead: false, //是否为只读模式
      forbid_copy: false, //是否禁止复制文本

      isPublishAnswer: false, //是否公布答案
      finishTest: false, //是否完成试卷
      //侧导航栏是否悬浮
      isFixed: false,
      topic_nav_style: "top:0px",
    };
  },
  computed: {
    //按填空符(三个下划线)划分字符串
    fillSymbolStr() {
      return function (str) {
        var q = str.split("___");
        return q;
      };
    },
  },

  created() {
    this.getExamData();
  },

  mounted() {
    // 监听滚动事件，然后用handleScroll这个方法进行相应的处理
    window.addEventListener("scroll", this.handleScroll);
  },

  methods: {
    //提交试卷
    submitTestpaper() {
      var topic = [];
      for (let i = 0; i < this.testData.topics.length; i++) {
        console.log(i);
        var item = this.testData.topics[i];
        //处理多选/填空答案
        if (item.topicType == 1 || item.topicType == 3) {
          if (item.userAnswer instanceof Array) {
            var userAnswer = "";
            item.userAnswer.forEach((c) => {
              userAnswer += c + "\n";
            });
            item.userAnswer = userAnswer.slice(0, -1);
          }
        }
        topic.push({
          classesId: this.classesId,
          topicId: item.topicId,
          examId: this.examId,
          userAnswer: item.userAnswer,
        });
      }

      var request = {
        examId: this.examId,
        userGrade: {
          examId: this.examId,
          classesId: this.classesId,
          answerTime: this.expendTime,
        },
        userTopics: topic,
      };

      console.log(request);
      submitExam(request).then((res) => {
        this.$message.success("提交作业成功");
        location.reload()
      });
    },

    //获取试卷数据
    getExamData() {
      getClassesExam(this.classesId, this.examId).then((res) => {
        console.log(res.data);
        this.processExamData(res.data);
      });
    },

    //处理试卷的题目数据
    processExamData(testData) {
      /* 判断试卷是否允许复制文本 */
      if (testData.permitCopy == 0) {
        this.forbid_copy = true;
      } else if (testData.permitCopy == 1) {
        this.forbid_copy = false;
      }

      /* 处理试卷的题目数据 */
      testData.topics.forEach((item) => {
        //按换行符分割字符串
        item.choice = item.choice.split(/[\n]/g);
        //添加用户答案
        if (item.topicType == 1 || item.topicType == 3) {
          item.userAnswer = [];
        } else {
          item.userAnswer = "";
        }
      });

      /* 判断用户是否已经完成试卷 */

      if (!testData.userGrade) {
        this.finishTest = false;
        this.isRead = false;
      } else {
        this.finishTest = true;
        this.isRead = true;
        //处理用户答案数据
        testData.userTopics.forEach((item) => {
          //按换行符分割字符串
          if (item.userAnswer.indexOf("\n") != -1) {
            item.userAnswer = item.userAnswer.split(/[\n]/g);
          }
          testData.topics.forEach((topic) =>{
            if(item.topicId==topic.topicId){
              topic.userAnswer=item.userAnswer
            }
          })
        });
        //根据题目id写入用户答案
        /* 判断是否公布答案 */
        if (testData.publishAnswer == 1) {
          this.isPublishAnswer = true;
          testData.topics.forEach((item, index) => {
            //按换行符分割字符串
            item.correctAnswer = item.correctAnswer.split(/[\n]/g);
            //添加教师是否批改判断
            item.status = testData.userTopics[index].topicStatus;
            //添加评改分数
            item.userScore = testData.userTopics[index].userScore;
          });
        }
      }

      this.testData = testData;

      //判断考试是否已经结束
      var nowDate = new Date().getTime();
      var deadline = testData.deadline;
      var deadlineDate = new Date(
        Date.parse(deadline.replace(/-/g, "/"))
      ).getTime();
      if (nowDate < deadlineDate && this.finishTest === false) {
        //开始计时
        this.remainTimer();
      } else {
        this.isRead = true;
      }

      /* 判断试卷是否打乱题目顺序 */
      if (testData.disruptOrder == 1) {
        testData.topics.sort(function () {
          return Math.random() > 0.5 ? -1 : 1;
        });
      }

      //按题目类型分类并保存
      var topics = this.testData.topics;
      var topicsIndex = 1;
      for (let i = 0; i < topics.length; i++) {
        for (let item of this.sortedTopics) {
          if (topics[i].topicType == item.topicType) {
            //添加
            topics[i].index = topicsIndex++;
            item.topic_content.push(topics[i]);
          }
        }
      }

      
    },

    //计算剩余时间
    remainTimer() {
      var time = this.testData.time * 60;
      var timer = setInterval(() => {
        this.remainTime = this.computateTime(time);
        time--;
        this.expendTime++;
        if (time < 0) {
          clearInterval(timer);
          this.$message("考试结束");
          this.submitTestpaper();
        }
      }, 500);
    },

    //格式化考试剩余时间
    computateTime(time) {
      var sec = "00";
      var minute = "00";
      var hour = "00";

      if (time >= 0) {
        sec = time % 60;
        if (sec < 10) {
          sec = "0" + sec;
        }
      }
      if (time / 60 >= 0) {
        minute = parseInt((time / 60) % 60);
        if (minute < 10) {
          minute = "0" + minute;
        }
      }
      if (time / 60 / 60 >= 0) {
        hour = parseInt((time / 60 / 60) % 60);
        if (hour < 10) {
          hour = "0" + hour;
        }
      }
      return hour + ":" + minute + ":" + sec;
    },

    //滚动事件
    handleScroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop; // 滚动条偏移量
      if (scrollTop > 154) {
        this.topic_nav_style = "top:" + (scrollTop + 62) + "px";
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    },

    //点击题号定位到题目位置
    topicNav(type, index) {
      var i = this.topicNavIndex_mixin(type, index);
      document
        .getElementsByClassName("_location")
        [i - 1].scrollIntoView({ behavior: "smooth", block: "start" });
    },

    //题目导航按钮颜色
    emptyAnswer(val) {
      //已完成试卷 与 是否公布答案
      if (this.finishTest === true && this.testData.publishAnswer == 1) {
        if (val.userScore == val.score) {
          return "correct";
        } else {
          return "error";
        }

        //未完成试卷
      } else {
        //多选题
        // if (val.topicType == 1) {
        //   if (val.userAnswer.join("") == "") {
        //     return "";
        //   }
        // }

        //填空题
        if (val.topicType == 3) {
          let q = val.question.split("___");
          if (q.length - 1 != val.userAnswer.length) {
            return "";
          }

          for (let item of val.userAnswer) {
            if (item == "") {
              return "";
            }
          }
        }

        //单选/判断/简答
        if (val.userAnswer.length == 0) {
          return "";
        }

        return "hasAnswer";
      }
    },

    //判断选择题是否回答正确
    isCheckboxCorrect(topic, val) {
      if (this.finishTest === false || this.testData.publishAnswer != 1) {
        return "";
      }
      let is = false;
      topic.correctAnswer.forEach((item) => {
        if (item == val) {
          is = true;
        }
      });
      if (is) {
        return "correct";
      } else {
        return "error";
      }
    },
  },
  
};
</script>

<style lang="scss" scoped>

li {
  list-style-type:none;
}
</style>
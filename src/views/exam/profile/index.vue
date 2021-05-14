<template>
  <div class="createTest testPaper app-container" @click.self="edit(-1,-1)">
    <div class="w">
      <div class="header"></div>
      <!-- 试卷信息 -->
      <div class="title">
        <el-input v-model="testData.examName" class="testName" placeholder="请输入内容"></el-input>
        <ul>
          <li class="test-info">出卷者: {{ testData.creatorName }}</li>
          <li class="test-info">
            答题时间:
            <el-input-number v-model="testData.time" controls-position="right" :step="10" size="mini" :min="1"></el-input-number>
            分钟
          </li>
          <li class="test-info">题目数量: 共 {{ topicNavIndex_mixin(4,sortedTopics[4].topic_content.length-1) }} 道</li>
          <li class="test-info">总分: {{ totalScore }} 分</li>
          <li class="test-info">
            及格分数:
            <el-input-number v-model="testData.passMark" controls-position="right" :step="1" size="mini" :min="0" :max="totalScore"></el-input-number>
            分
          </li>
          <li style="clear:both;"></li>
        </ul>
        <ul>
          <li class="test-info">是否允许复制文本:
            <el-switch v-model="testData.permitCopy" active-color="#409EFF" inactive-color="#ccc"> </el-switch>
          </li>
          <li class="test-info">是否打乱题目顺序:
            <el-switch v-model="testData.disruptOrder" active-color="#409EFF" inactive-color="#ccc"> </el-switch>
          </li>
          <li class="test-info">是否自动评分:
            <el-switch v-model="testData.autoMack" active-color="#409EFF" inactive-color="#ccc"> </el-switch>
            <el-tooltip class="item" effect="light" content="取消自动评分系统依然会自动批改,但会先显示分数为0分,等待教师审批确认" placement="bottom-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </li>
          <li class="fr">
            <el-button size="mini" type="primary" @click="submit()">保存</el-button>
          </li>
          <li style="clear:both;"></li>
        </ul>

      </div>

      <div class="test-content" @click.self="edit(-1,-1)">
        <div class="topics">
          <!-- 所有题目 -->
          <div class="topic" v-for="(s_topics, index) in sortedTopics" :key="index">
            <!-- 按类型分类好的题目 -->
            <div class="topicsType" v-if="s_topics.topic_content.length != 0">
              <div class="bigQuestionName">
                <h4> {{bigQuestionName_mixin(s_topics.type,index)}} </h4><!-- 题目类型名称 -->
                <div class="allScore">
                  <button :class="s_topics.showAllScore? 'active':''" @click="s_topics.showAllScore = !s_topics.showAllScore">统一设置题目分数</button>
                  <el-input v-if="s_topics.showAllScore" @change="setAllScore($event,s_topics.type)" v-model="s_topics.score" placeholder="请输入分数"></el-input>
                </div>
              </div>

              <div v-for="(t, tIndex) in s_topics.topic_content" :key="tIndex" @click="edit(s_topics.type,tIndex)">
                <div class="topic-content" :class="isEdit(s_topics.type,tIndex)?'isEdit':''">
                  <!-- 题目 -->
                  <div class="question">
                    <strong class="question_nunber">{{ topicNavIndex_mixin(s_topics.type,tIndex) }}、</strong>
                    <span v-if="isEdit(s_topics.type,tIndex)">
                      <el-input v-model="t.question" type="textarea" autosize></el-input>
                    </span>
                    <span v-else>{{ t.question }}</span>
                  </div>

                  <!-- 单项选择题 -->
                  <div class="userAnswer" v-if="s_topics.type==0">
                    <div class="radios">
                      <el-radio v-for="(item, index) in t.choice" :key="index" v-model="t.correctAnswer" :label="item">
                        <span class="topicNavIndex">{{String.fromCharCode(65+index)}}、</span>
                        <span v-if="editInedx.type==0&&editInedx.index==tIndex">
                          <el-input v-model="t.choice[index]" type="textarea" autosize></el-input>
                          <el-button class="delRadios" size="mini" type="danger" v-if="t.choice.length>2" @click="delRadios(0,tIndex,index)">
                            <i class="el-icon-close"></i>
                          </el-button>
                        </span>
                        <span v-else>{{item}}</span>
                      </el-radio>
                    </div>
                    <el-button class="addRadios" size="mini" icon="el-icon-plus" @click="addRadios(s_topics.type,tIndex)">添加选项</el-button>
                  </div>

                  <!-- 多项选择题 -->
                  <div class="userAnswer" v-if="s_topics.type==1">
                    <div class="checkbox">
                      <el-checkbox-group v-model="t.correctAnswer">
                        <el-checkbox :label="item" v-for="(item, index) in t.choice" :key="index">
                          <span class="topicNavIndex">{{String.fromCharCode(65+index)}}、</span>
                          <span v-if="editInedx.type==1&&editInedx.index==tIndex">
                            <el-input v-model="t.choice[index]" type="textarea" autosize></el-input>
                            <el-button class="delRadios" size="mini" type="danger" v-if="t.choice.length>2" @click="delRadios(1,tIndex,index)">
                              <i class="el-icon-close"></i>
                            </el-button>
                          </span>
                          <span v-else>{{item}}</span>
                        </el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <el-button class="addRadios" size="mini" icon="el-icon-plus" @click="addRadios(s_topics.type,tIndex)">添加选项</el-button>
                  </div>

                  <!-- 判断题 -->
                  <div class="userAnswer" v-if="s_topics.type==2">
                    <div class="TrueOrFalse">
                      <el-radio v-model="t.correctAnswer" label="true">正确</el-radio>
                      <el-radio v-model="t.correctAnswer" label="false">错误</el-radio>
                    </div>
                  </div>

                  <!-- 填空题 -->
                  <div class="userAnswer" v-if="s_topics.type==3">
                    <el-button size="mini" @click="addFillSymbol(tIndex)">插入填空符</el-button>
                    <span style="font-size:12px;">(三个下划线为一个填空符)</span>

                    <div class="fillInBlank">
                      <div v-for="(q, index) in fillSymbolStr(t.question)" :key="index">
                        <el-input type="textarea" autosize placeholder="请回答" v-if="index!=fillSymbolStr(t.question).length-1" v-model="t.correctAnswer[index]">
                        </el-input>
                      </div>
                    </div>
                  </div>

                  <!-- 简答题 -->
                  <div class="userAnswer" v-if="s_topics.type==4">
                    <div class="text">
                      <strong>&nbsp;&nbsp;关键字</strong>
                      <div v-for="(q, index) in t.correctAnswer" :key="index">
                        <el-input type="textarea" autosize placeholder="请输入关键字" v-model="t.correctAnswer[index]"> </el-input>
                      </div>
                      <el-button class="addRadios" size="mini" icon="el-icon-plus" @click="addKeyWord(tIndex)">添加关键字</el-button>
                      <!-- {{t.correctAnswer}} -->
                    </div>
                  </div>

                  <!-- 正确答案 -->
                  <p class="correctAnswer" >
                    <strong>正确答案: </strong>
                    {{ t.correctAnswer }}
                  </p>
                  <div class="difficulty fl">
                    <strong>难度: </strong>
                    <span v-if="isEdit(s_topics.type,tIndex)">
                      <el-select v-model="t.difficulty" placeholder="请选择" size="mini">
                        <el-option v-for="item in topicDifficultyOptions" :key="item" :label="item" :value="item">
                        </el-option>
                      </el-select>
                    </span>
                    <span v-else>{{t.difficulty}}</span>
                  </div>
                  <div class="topicScore fr">
                    <strong>分值: </strong>
                    <span v-if="isEdit(s_topics.type,tIndex)">
                      <el-input size="mini" v-model="t.score"></el-input>
                    </span>
                    <span v-else>{{t.score}}</span>
                    (分)
                  </div>
                  <div class="analysis">
                    <strong>题目解析: </strong>
                    <span v-if="isEdit(s_topics.type,tIndex)">
                      <el-input v-model="t.analysis" type="textarea" autosize></el-input>
                    </span>
                    <span v-else>{{t.analysis}}</span>
                  </div>

                </div>
                <el-divider></el-divider>
              </div>

            </div>
          </div>

        </div>

        <!-- 题目导航 -->
        <div class="topic-nav" :class="isFixed ? 'isFixed' : ''" :style="topic_nav_style">
          <!-- 工具 -->
          <div class="tool">
            <transition name="el-zoom-in-top">
              <div v-show="!isEdit(-1,-1)">
                <el-button icon="el-icon-top" title="上移" @click="moveTopic(-1)"></el-button>
                <el-button icon="el-icon-bottom" title="下移" @click="moveTopic(1)"></el-button>
                <el-button type="danger" icon="el-icon-delete" title="删除" @click="delTopic()"></el-button>
              </div>
            </transition>
          </div>

          <!-- 导航按钮 -->
          <ul v-for="(topics, Topics_index) in sortedTopics" :key="Topics_index">
            <li class="topic-nav-item" @click.self="edit(-1,-1)">
              <div class="nav-title">{{topicTypeName_mixin(topics.type)}}</div>
              <span class="topic-nav-button" :class="editInedx.type==topics.type" v-for="(item , index) in topics.topic_content" :key="index" @click="topicNav(Topics_index,index)">
                {{topicNavIndex_mixin(Topics_index,index)}}
              </span>

              <span class="topic-nav-button" @click="newTopic(topics.type)">
                <i class="el-icon-plus"></i>
              </span>
            </li>
          </ul>
        </div>

        <div style="clear:both;"></div>
      </div>

      <div class="back-top" @click="backTop_mixin()">
        <i class="el-icon-arrow-up"></i>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import "@/assets/styles/test-paper.scss";
import examProfile from "@/mixins/examProfile-mixins";
import { getExam, addExam,updateExam } from '@/api/exam'

export default {
  mixins: [examProfile],
  data() {
    return {
      //按题目类型分类好的题目数据
      //题目类型==>  0:单选题  1:多选题  2:判断题  3:填空题  4:简答题
      sortedTopics: [
        { type: 0, topic_content: [], score: 0, showAllScore: false },
        { type: 1, topic_content: [], score: 0, showAllScore: false },
        { type: 2, topic_content: [], score: 0, showAllScore: false },
        { type: 3, topic_content: [], score: 0, showAllScore: false },
        { type: 4, topic_content: [], score: 0, showAllScore: false },
      ],

      // //试卷数据
      testData: {
        examId: undefined,
        examName: "", //试卷名称
        time: 60, //答题时间
        topicNum: 0, //题目数量
        passMark: 0,
        autoMack: 1, //是否自动评分
        permitCopy: 1, //是否允许复制文本
        repeatTest: 1, //用户可重复考试次数
        disruptOrder: 0, //是否打乱题目顺序
        creatorName: store.getters.name
      },

      //当前编辑的题目索引
      editInedx: {
        type: "-1",
        index: "-1",
        input: "-2",
      },

      topicDifficultyOptions: ["简单", "中等", "困难"], //题目难度选项

      //侧导航栏是否悬浮
      isFixed: false,
      topic_nav_style: "top:0px",
    };
  },

  computed: {
    //试卷总分
    totalScore() {
      var score = 0;
      this.sortedTopics.forEach((element) => {
        element.topic_content.forEach((item) => {
          // console.log(typeof(item.score));
          score += parseInt(item.score);
        });
      });
      this.testData.totalScore = score;
      return score;
    },

    //按填空符(三个下划线)划分字符串
    fillSymbolStr() {
      return function (str) {
        var q = str.split("___");
        return q;
      };
    },
  },

  created() {
    const examId = this.$route.query.id;
    // 如果试卷id存在,则为编辑试卷
    if (typeof examId != "undefined") {
      this.getExam();
    }
  },

  mounted() {
    // 监听滚动事件，然后用handleScroll这个方法进行相应的处理
    window.addEventListener("scroll", this.handleScroll);
  },

  methods: {
    //提交试卷
    submit() {
      /*  处理题目信息 */
      var topicData = [];
      this.sortedTopics.forEach((element) => {
        if (element.topic_content.length != 0) {
          element.topic_content.forEach((item) => {
            //深拷贝
            var newItem = JSON.parse(JSON.stringify(item));
            topicData.push(newItem);
          });
        }
      });

      //处理选择题选项
      topicData.forEach((item) => {
        var choice = "";
        item.choice.forEach((c) => {
          choice += c + "\n";
        });
        item.choice = choice.slice(0, -1);
      });

      //处理正确答案
      topicData.forEach((item) => {
        if (item.correctAnswer instanceof Array) {
          var correctAnswer = "";
          item.correctAnswer.forEach((c) => {
            correctAnswer += c + "\n";
          });
          item.correctAnswer = correctAnswer.slice(0, -1);
        }
      });

      //处理试卷信息
      var testData = JSON.parse(JSON.stringify(this.testData));
      testData.topics = topicData;
      testData.creatorName = store.getters.name;
      testData.topicNum = topicData.length;
      testData.autoMack = testData.autoMack == true ? "1" : "0";
      testData.disruptOrder = testData.disruptOrder == true ? "1" : "0";
      testData.permitCopy = testData.permitCopy == true ? "1" : "0";


      if (testData.examId != undefined) {
        updateExam(testData).then(res => {
            this.msgSuccess("修改成功");
        })
      } else {
        addExam(testData).then(res => {
          this.msgSuccess("创建成功");
        })
      }
       this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/index" });

    },

    getExam() {
       getExam(this.$route.query.id).then(res => {
         var testData = res.data;
         testData.topics.forEach((item) => {
            if (item.topicType == 4 || item.topicType == 3 || item.topicType == 1) {
              item.correctAnswer = item.correctAnswer.split(/[\n]/g);
            }
            //按换行符分割字符串
            item.choice = item.choice.split(/[\n]/g);
          });
          testData.autoMack = testData.autoMack == 1 ? true : false;
          testData.disruptOrder = testData.disruptOrder == 1 ? true : false;
          testData.permitCopy = testData.permitCopy == 1 ? true : false;
          this.testData = testData;
          var topics = this.testData.topics;
          for (let i = 0; i < topics.length; i++) {
            for (let item of this.sortedTopics) {
              if (topics[i].topicType == item.type) {
                item.topic_content.push(topics[i]);
              }
            }
          }

       })
    },

    //统一设置题目分数
    setAllScore(val , type){
      val = parseInt(val)
      this.sortedTopics[type].topic_content.forEach(item =>{
        item.score = val;
      })
    },

    //设置当前编辑中的题目
    edit(type, index) {
      if (this.editInedx.type == type && this.editInedx.index == index) {
        return;
      }
      this.editInedx.type = type;
      this.editInedx.index = index;
    },

    //是否在编辑状态
    isEdit(type, index, input = -2) {
      if (
        this.editInedx.type == type &&
        this.editInedx.index == index &&
        this.editInedx.input == input
      ) {
        return true;
      } else {
        return false;
      }
    },

    //滚动事件
    handleScroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop; // 滚动条偏移量
      if (scrollTop > 154) {
        this.topic_nav_style = "top:" + (scrollTop + 20) + "px";
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    },

    //点击题号导航跳转
    topicNav(type, index) {
      var totalIndex = this.topicNavIndex_mixin(type, index) - 1;
      setTimeout(() => {
        document
          .getElementsByClassName("topic-content")
          [totalIndex].scrollIntoView({ behavior: "smooth" });
      }, 100);
      this.edit(type, index);
    },

    //新建题目
    newTopic(type) {
      this.sortedTopics[type].topic_content.push({
        topicType: type,
        question: "",
        choice: ["", "", "", ""],
        correctAnswer: [],
        analysis: "",
        difficulty: "",
        score: 10,
        subjectId: "1",
      });

      var time = setTimeout(() => {
        this.topicNav(type, this.sortedTopics[type].topic_content.length - 1);
        clearInterval(time);
      }, 100);
    },

    //删除当前正在编辑的题目
    delTopic() {
      var type = this.editInedx.type;
      var index = this.editInedx.index;
      this.sortedTopics[type].topic_content.splice(index, 1);
    },

    //上移或下移当前正在编辑的题目  -1:上移   1:下移
    moveTopic(n) {
      var type = this.editInedx.type;
      var index = this.editInedx.index;

      if (index == 0 && n == -1) {
        return;
      }
      if (index == this.sortedTopics[type].topic_content.length - 1 && n == 1) {
        return;
      }

      var topic = this.sortedTopics[type].topic_content[index];
      var upTopic = this.sortedTopics[type].topic_content[index + n];

      this.sortedTopics[type].topic_content.splice(index, 1, upTopic);
      this.sortedTopics[type].topic_content.splice(index + n, 1, topic);

      var time = setTimeout(() => {
        this.topicNav(type, index + n, 10);
        clearInterval(time);
      }, 100);
    },

    //删除选项
    delRadios(type, tIndex, index) {
      this.sortedTopics[type].topic_content[tIndex].choice.splice(index, 1);
    },

    //添加选项
    addRadios(type, tIndex) {
      var choiceLength =
        this.sortedTopics[type].topic_content[tIndex].choice.length + 1;
      if (choiceLength > 10) {
        this.$message({
          message: "不能再添加选项了喔!",
          type: "warning",
        });
        return;
      }
      this.sortedTopics[type].topic_content[tIndex].choice.push(
        "选项" + choiceLength
      );
    },

    //添加填空符
    addFillSymbol(tIndex) {
      var str = this.sortedTopics[3].topic_content[tIndex].question;
      // console.log(str);
      this.sortedTopics[3].topic_content[tIndex].question = str + "___";
    },

    //添加关键字
    addKeyWord(tIndex) {
      this.sortedTopics[4].topic_content[tIndex].correctAnswer.push("");
      console.log(this.sortedTopics[4].topic_content[tIndex]);
    },
  },
};
</script>

<style lang="scss" scoped>

li {
  list-style-type:none;
}
</style>

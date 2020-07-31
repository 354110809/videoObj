<template>
    <div id="modelDetails">
        <h3 class="guide-tt">老师介绍</h3>
        <div class="guide-bd">
            <img
                src="//10.url.cn/eth/ajNVdqHZLLDYyb76pOLmW7h9knm5pvEfdDLpTjSBuCEyQIQNgzKBpGjRVsT0ZVWODInTKcqSrro/130"
                alt="连老师"
            />
            <div class="text-right">
                <h4 class="text-tt">{{CourseData.teacherName}}</h4>
                <div class="text-intro">5年大数据工作经验，曾任中国电信大数据主管，玖富集团技术架构师等职位，参与过中国电信用户移动轨迹分析平台，舆情分析系统，玖富金融平台等多个大型互联网项目，精通SSM，SpringBoot，SpringCloud等主流Java开源框架以及Hadoop，Kafka，Hive，HBASE Storm，Spark，Kylin等主流大数据技术。</div>
            </div>
        </div>
        <div class="guide-info">
            <h6>简介</h6>
            <p>{{CourseData.courseDescribe}}</p>
        </div>
        <div class="intro-course">
            <img
                src="//10.url.cn/qqke_course_info/ajNVdqHZLLCM1HqxVov0FiaWauiclr5fbz4aUOzOib5Miczg5sbiaalKDLlD6Js4tqjMOd1UNibmLzEwo/"
            />
            <img
                src="//10.url.cn/qqke_course_info/ajNVdqHZLLABNMzIwmXChy1ywBs7vUEPlOMaJATfRK4UQvZNErX7D9AzVnicwpod6lcVhY4lAPLI/"
            />
            <img
                src="//10.url.cn/qqke_course_info/ajNVdqHZLLAxdJOhsP3MYNfnr25RT8Dc1bdwC4xna77ezuqfgvmHJXmFggD5E1QrF59pLzSYZbE/"
            />
            <img
                src="//10.url.cn/qqke_course_info/ajNVdqHZLLCBYwBicYibo4lxTwKqXA5UVHYiaKbiaIicugRBFbc2zVtuXIF6qRib0tDLwu8hQx2sjmiaAg/"
            />
            <img
                src="//10.url.cn/qqke_course_info/ajNVdqHZLLBZln1OZT5hemf5nKOvWeS78B7fRKwJJliamDuEM2QtPGljyUibPO4acQPxx0u5Xedas/"
            />
            <img
                src="//10.url.cn/qqke_course_info/ajNVdqHZLLAKN7hFiamoBJXyWFfr3f6u9zRBkLPciaST7icicicQJWiaAreyQnHWMgE2Rcfnyl14Stgz0/"
            />
            <img
                src="//10.url.cn/qqke_course_info/ajNVdqHZLLBCavqdX2RCYjM6SpCNrgzTe4HXlnZdVpSLsdt5Xd1bdDQam3c42k011NGrLic9ANYI/"
            />
            <img
                src="//10.url.cn/qqke_course_info/ajNVdqHZLLCt7roqQUuXLWThHWaF4J0015YibwxXibnMpwhUoq5Vo3K5VhHoY4wdwClIL8ZBan2NI/"
            />
            <img
                src="//10.url.cn/qqke_course_info/ajNVdqHZLLASCgv16ew1B3IGq4yn3eNxWYrzyk9Z3ZQpWWyqWB0SyZLCmtlmdOfZQZjNm2OW6QI/"
            />
            <img
                src="//10.url.cn/qqke_course_info/ajNVdqHZLLAhdlDBiaMRbhN3MkLWRhUmTu3libanf3eQYBrfic5UIHiaMaQSMlO2tv9YTWSaqg7pbjo/"
            />
        </div>
    </div>
</template>
<script>
import { mapActions } from "vuex"
export default {
    props: ["CourseData"],
    data() {
        return {};
    },
    created() {},
    mounted() {
	},
    methods: {
        ...mapActions([
            'GetToken',
        ])
    }
};
</script>
<style lang='less' scoped>
#modelDetails {
    .guide-tt {
        font-size: 16px;
        line-height: 30px;
        margin-bottom: 10px;
    }
    .guide-bd {
        display: flex;
        img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            margin-right: 20px;
        }
        .text-right {
            .text-tt {
                margin-bottom: 10px;
            }
            .text-intro {
                width: 300px;
                height: 60px;
                font-size: 14px;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
            }
        }
    }
    .guide-info {
        display: flex;
        padding: 20px 0;
        h6 {
            width: 100px;
            color: #999;
            letter-spacing: 20px;
        }
        p {
            font-size: 14px;
            color: #333;
            width:735px;
        }
    }
    .intro-course {
        img {
            width: 100%;
            display: block;
        }
    }
}
</style>
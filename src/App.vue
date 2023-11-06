<template>
    <div class="py-[20px] px-[15px]">
        <div class="flex justify-between items-baseline px-[30px]">
            <div class="flex flex-col">
                <h2 class="media-h">{{ category_name }}</h2>
                <p style="margin: 10px 0 14px;">Справка: Тональность определяется от общего числа публикаций</p>
            </div>
            <div class="flex flex-col">
                <div class="flex items-center">
                    <i class="fa-solid fa-clock-rotate-left mr-[5px]"></i>
                    <span class="mr-[6px]">Период:</span>
                    <VSelect
                        :list="[
                            { id: 'day', name: 'За день' },
                            { id: 'month', name: 'За месяц' },
                            { id: 'year', name: 'За год' },
                        ]"
                        :trigger="'id'"
                        style="max-width: 100px;"
                        min-width="0"
                        :default-input="'За год'"
                        :name="'name'"
                        :list_modal="date_modal"
                        :modal_name="'date'"
                        :set_list_modal="setDateModal"
                        :callback="updateDate"
                    />
                </div>
                <label class="flex" style="margin: 10px 0 14px;">
                    <input type="checkbox" style="margin: 0 4px 0 0;" v-model="sentiments_by_percent">
                    Тональность в процентах
                </label>
            </div>
        </div>
        <div class="mediarating-table">
            <div class="table-header">
                <span class="media-th" style="width: 22.2%;border-radius: 10px 0 0 0;" @click="order_by = ''" :class="{
                        active: order_by == ''
                    }">
                    <p class="table-header-text" align="center">По алфавиту</p>
                </span>
                <span class="media-th" style="width: 16.6%;" @click="order_by = 'count'" :class="{
                        active: order_by == 'count'
                    }">
                    <p class="table-header-text" align="center">Количество публикаций</p>
                </span>
                <span class="media-th" style="width: 21.1%;" @click="order_by = 'positive'" :class="{
                        active: order_by == 'positive'
                    }">
                    <p class="table-header-text" align="center">Позитив</p>
                </span>
                <span class="media-th" style="width: 21.1%;" @click="order_by = 'neutral'" :class="{
                        active: order_by == 'neutral'
                    }">
                    <p class="table-header-text" align="center">Нейтрал</p>
                </span>
                <span class="media-th" style="width: 21.1%;border-radius: 0 10px 0 0;" @click="order_by = 'negative'" :class="{
                        active: order_by == 'negative'
                    }">
                    <p class="table-header-text" align="center">Негатив</p>
                </span>
            </div>
            <div class="tbody">
                <VLoading v-if="sorted_category_projects.length == 0" />
                <TransitionGroup name="list" tag="div" v-else>
                    <div class="flex items-center h-[50px] hover:bg-[#eee]" v-for="project in sorted_category_projects" :key="project.project_id">
                        <span class="project-name px-[15px] text-[14px] truncate" style="width: 22.2%;">{{ project.name }}</span>
                        <div class="px-[15px]" style="width: 16.6%;">
                            <div class="relative h-[16px] bg-[#357ebd]" style="border-radius: 10px;" :style="{
                                width: ((project.count / highest_count) * 100)+'%'
                            }">
                                <div class="count absolute top-[-8px] left-0 right-0 text-center">
                                    <span
                                        class="m-auto bg-white text-[12px] font-bold h-[16px] inline-flex items-center px-[5px] whitespace-nowrap"
                                        style="border-radius: 5px;border: 1px solid #357ebd;"
                                    >{{ project.count.push_space() }}</span>
                                </div>
                                <img v-if="project.count == highest_count" class="absolute right-[7px] bottom-[-10px]" alt="image" src="./assets/img/1.png">
                            </div>
                        </div>
                        <div class="flex h-[16px] px-[15px] sentiments" style="width: 63.3%;">
                            <div
                                class="relative h-full bg-[#1ab394]"
                                :style="{
                                    width: project.positive_percent+'%',
                                }"
                                v-if="project.positive_percent > 0"
                            >
                                <div class="count absolute top-[-8px] left-0 right-0 text-center">
                                    <span
                                        class="m-auto bg-white text-[12px] font-bold h-[16px] inline-flex items-center px-[5px] whitespace-nowrap"
                                        style="border-radius: 5px;border: 1px solid #1ab394;"
                                    >{{ sentiments_by_percent ? project.positive_percent.push_space()+'%' : project.positive.push_space() }}</span>
                                </div>
                                
                                <img v-if="project.positive == highest_positive" class="absolute right-[7px] bottom-[-10px]" alt="image" src="./assets/img/1.png">
                            </div>
                            <div
                                class="relative h-full bg-[#F2C94C]"
                                style=""
                                :style="{
                                    width: project.neutral_percent+'%',
                                }"
                                v-if="project.neutral_percent > 0"
                            >
                                <div class="count absolute top-[-8px] left-0 right-0 text-center">
                                    <span
                                        class="m-auto bg-white text-[12px] font-bold h-[16px] inline-flex items-center px-[5px] whitespace-nowrap"
                                        style="border-radius: 5px;border: 1px solid #F2C94C;"
                                    >{{ sentiments_by_percent ? project.neutral_percent.push_space()+'%' : project.neutral.push_space() }}</span>
                                </div>
                                
                                <img v-if="project.neutral == highest_neutral" class="absolute right-[7px] bottom-[-10px]" alt="image" src="./assets/img/1.png">
                            </div>
                            <div
                                class="relative h-full bg-[#EC5D5D]"
                                :style="{
                                    width: project.negative_percent+'%',
                                }"
                                v-if="project.negative_percent > 0"
                            >
                                <div class="count absolute top-[-8px] left-0 right-0 text-center">
                                    <span
                                        class="m-auto bg-white text-[12px] font-bold h-[16px] inline-flex items-center px-[5px] whitespace-nowrap"
                                        style="border-radius: 5px;border: 1px solid #EC5D5D;"
                                    >{{ sentiments_by_percent ? project.negative_percent.push_space()+'%' : project.negative.push_space() }}</span>
                                </div>
                                
                                <img v-if="project.negative == highest_negative" class="absolute right-[7px] bottom-[-10px]" alt="image" src="./assets/img/1.png">
                            </div>
                        </div>
                    </div>
                </TransitionGroup>
            </div>
        </div>
        <p class="px-[15px] pt-[25px] pb-[10px] text-[14.4px]">
            *Медиа индекс - показатель системы iMAS, позволяющий качественно проанализировать эффективность PR. Процентное соотношение от общего количества материалов СМИ и соцсетей.<br><br>
            Мониторинг осуществляется в режиме реального времени, путем сбора и анализа всех упоминаний в интернет-среде (СМИ, соцсети, блоги, веб-ресурсы и др.), тональность определяется машинным способом с определенной долей погрешности.
        </p>
    </div>
</template>

<script>

import axios from 'axios'
import VSelect from '@/components/UI/VSelect.vue'
import VLoading from '@/components/UI/VLoading.vue'

export default {
    name: 'App',
    components: {
        VSelect,
        VLoading,
    },
    data() {
        const category = document.querySelector('#category')?.value ?? '';
        const category_name = (document.querySelector('#mediarating .li_no_rpojects.active a span')?.textContent ?? category).trim();
        return {
            category_projects: [],
            category,
            category_name,
            date: 'year',
            date_modal: '',
            order_by: 'count', // positive, neutral, negative,
            sentiments_by_percent: false
        }
    },
    methods: {
        updateDate(value) {
            this.date = value;
            this.getCategoryObjects()
        },
        setDateModal(name) {
            this.date_modal = name;
        },
        getCategoryObjects() {
            this.category_projects = [];
            axios.get(`/ru/mediarating/category-objects?category=${this.category ?? ''}&date=${this.date}`)
                .then(response => {
                    console.log('mediarating/category-objects category=banks', response)
                    let { category_projects, projects_info } = response.data;

                    projects_info = projects_info.reduce((obj, project) => ({
                        ...obj,
                        [project.project_id]: project
                    }), {})
                    this.category_projects = category_projects.map(project => {
                        project = {
                            ...project,
                            count: 0,
                            positive: 0,
                            neutral: 0,
                            negative: 0,
                            ...projects_info[project.id_project],
                        }
                        project.positive_percent = parseInt((project.positive / project.count) * 100)
                        project.neutral_percent = parseInt((project.neutral / project.count) * 100)
                        project.negative_percent = parseInt((project.negative / project.count) * 100)
                        return project
                    })
                })
                .catch(error => console.error(error))
        },
        // getQueryParams() {
        //     return location.search.replace('?', '').split('&').reduce((obj, param) => {
        //         const [key, value] = param.split("=")
        //         if (key) obj[key] = value ?? ''
        //         return obj
        //     }, {})
        // },
    },
    mounted() {
        this.getCategoryObjects()
    },
    computed: {
        highest_count() {
            return Math.max(...this.category_projects.map(project => project.count))
        },
        highest_positive() {
            return Math.max(...this.category_projects.map(project => project.positive))
        },
        highest_neutral() {
            return Math.max(...this.category_projects.map(project => project.neutral))
        },
        highest_negative() {
            return Math.max(...this.category_projects.map(project => project.negative))
        },
        sorted_category_projects() {
            let projects = JSON.parse(JSON.stringify(this.category_projects));

            if (projects.length == 0 || this.order_by == '') return projects;

            let by_percent = '';

            if (this.sentiments_by_percent && !['', 'count'].includes(this.order_by)) by_percent = '_percent';

            projects.sort((a,b) => (b[this.order_by + by_percent] - a[this.order_by + by_percent]))

            return projects
        },
    },
}
</script>
  
<style>

body #app {
    font-size: 16px;
    min-height: calc(100vh - 62.81px);
    background: white;
}

.media-h {
    margin-top: -5px !important;
    color: rgb(53, 126, 189);
    font-weight: bold;
    font-size: 30px;
    line-height: 1.25;
}

.table-header {
    position: relative;
    top: 0px;
    display: flex;
    height: 40px;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
}

.media-th {
    border: 1px solid rgb(209, 209, 209);
    position: relative;
    display: flex;
    height: 100%;
    justify-content: space-around;
    align-items: center;
    cursor: pointer;
}

.table-header-text {
    position: relative;
    font-size: 16px;
    color: rgb(171, 171, 171);
    margin: 0;
    padding: 0;
    width: 100%;
    font-weight: normal;
}
.media-th:hover .table-header-text {
    color: #6e6e6e;
}
.media-th:active .media-th,
.media-th.active .table-header-text {
    color: #333;
}
.media-th.active {
    cursor: default;
}

.project-name {
    color: #333;
    font-weight: 700;
}
.sentiments > *:first-child {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
}
.sentiments > *:last-child {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
}

.tbody {
    border: 1px solid #d1d1d1;
    border-top: none;
    border-radius: 0 0 10px 10px;
}
.mediarating-table {
    box-shadow: 0 0 7px #7f7f7f59;
    border-radius: 10px;
}

/*    TransitionGroup    */

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
  
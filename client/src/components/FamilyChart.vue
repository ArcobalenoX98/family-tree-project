<!-- src/components/FamilyChart.vue -->
<template>
  <div
    id="FamilyChart"
    class="f3"
    style="width:100%; height:900px; margin:auto; background-color:rgb(33,33,33); color:#fff;"
  ></div>
   <div
     id="FamilyChartForm"
     style="position: absolute; top: 20px; right: 20px; z-index: 10;"
   ></div>
</template>

<script>
import f3 from 'family-chart';                   // family-chart@0.7.0
import 'family-chart/styles/family-chart.css';
import axios from 'axios';

export default {
  name: 'FamilyChart',
  props: {
    // 控制是否启用编辑功能
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chartInstance: null
    };
  },
  async mounted() {
    // 1) 拉取后端数据
    const initialData = await this.fetchAll();

    // 4) 渲染图表
    console.log('🎯 准备渲染的节点数组：', initialData);
    //this.chart.updateTree(nodes);
    this.initOrUpdateChart(initialData);
  },
  methods: {
    // 从后端获取所有成员
    async fetchAll() {
      try {
        const res = await axios.get('/api/family');
        return res.data;
      } catch (err) {
        console.error('拉取成员列表失败', err);
        return [];
      }
    },

    // 创建或更新图表实例initOrUpdateChart
    initOrUpdateChart(data) {
      // —— 调试输出，确认传入的数据 ——  
      console.group('🔍 initOrUpdateChart 收到的数据');
      console.log(data);
      console.groupEnd();

      if (!this.chartInstance) {
        //—— 1) 初始化 chart 实例 & 配置 UI ——
        const f3Chart = f3
          .createChart('#FamilyChart', data)
          .setTransitionTime(1000)
          .setCardXSpacing(250)
          .setCardYSpacing(150)
          .setSingleParentEmptyCard(true, { label: 'ADD' })
          .setShowSiblingsOfMain(false)
          .setOrientationVertical();

        const f3Card = f3Chart
          .setCard(f3.CardHtml)
          .setCardDisplay([['first name','last name'],['birthday']])
          .setCardDim({ width:100, height:100, img_width:90, img_height:90 })
          .setMiniTree(true)
          .setStyle('imageCircle')
          .setOnHoverPathToMain();

        // —— 2) 先渲染主图 ——   
        f3Chart.updateTree();
        this.chartInstance = f3Chart;
        
        
        // —— 3) 再安全地尝试编辑功能 ——
        if (this.editable) {
          try{
            const f3EditTree = f3Chart
              .editTree()
              .fixed(true)
              .setFields(['first name','last name','birthday','avatar'])
              .setEditFirst(true);

              f3EditTree.setupModal('#FamilyChartForm')    // ① 指定表单挂载点
              f3EditTree.setEdit()                         // ② 切换到编辑模式
              f3EditTree.setCardClickOpen(f3Card)                // ③ 绑定卡片点击→打开表单（默认插件）

              f3EditTree.setPostSubmit(async datum => {
              console.group('💡 f3EditTree.postSubmit 数据检查')
              console.log('datum:', datum);
              console.log('datum.rels:', datum.rels);
              
              // --- 1. 先安全拿到关系数组 ---
              let spouses = datum.rels.spouses;
              let children = datum.rels.children;
              let father = datum.rels.father;
              let mother = datum.rels.mother;
              

              //如果它们被当作字符串传入进来了，就尝试JSON.parse
              if (typeof spouses === 'string') {
                try { spouses = JSON.parse(spouses); }
                catch (e) { spouses = []; }
              }
              if (typeof children === 'string') {
                try { children = JSON.parse(children); }
                catch (e) { children = []; }
              }
              if (typeof father === 'string') {
                try { father = JSON.parse(father); }
                catch (e) { father = null; }
              } 
              if (typeof mother === 'string') {
                try { mother = JSON.parse(mother); }
                catch (e) { mother = null; }
              }            

              //保证他们是数组
              if (!Array.isArray(spouses)) spouses = [];
              if (!Array.isArray(children)) children = [];

              // --- 2. 只保留合法的 24 位十六进制字符串 ---
              const isHex24 = id => /^[0-9a-fA-F]{24}$/.test(id);
              spouses  = spouses.filter(isHex24);
              children = children.filter(isHex24);
              //father = father.filter(isHex24);
              //mother = mother.filter(isHex24);

              // 组装后端需要的 payload
              
              const payload = {
                firstName: datum.data['first name'],
                lastName:  datum.data['last name'],
                birthday:  datum.data.birthday,
                avatar:    datum.data.avatar,
                gender:    datum.data.gender,
                father, 
                mother,
                spouses,
                children
              };
              console.log('➡️ 最终 payload:', JSON.stringify(payload));
              console.groupEnd();

              try{
                const isObjectId = id => /^[0-9a-fA-F]{24}$/.test(id);
                if (datum.id && isObjectId(datum.id)) {
                  // 有 id → 更新
                  await axios.put(`/api/family/${datum.id}`, payload);
                } else {
                  //新增成员的情况
                  const createRes = await axios.post('/api/family', payload);
                  const newId = createRes.data._id || createRes.data.id;
                  //调用封装的同步函数，将新成员ID写回相关成员
                  await this.syncNewMemberRelations(newId, payload);

                }
              }catch(err){
                console.error('🔥 后端返回错误：', err.response?.data || err.message);
                throw err;             
              }

              // 请求后重新拉一次数据、更新图表
              const fresh = await this.fetchAll();
              this.chartInstance.store.updateData(fresh);
              this.chartInstance.updateTree();
            });
          }catch(err){
            // 即使这块报错，也不影响上面已经渲染好的图
            console.error('🔥 编辑功能初始化失败：', err);            
          }
        }
        
      } else {
        // 后续只更新数据
        this.chartInstance.store.updateTree(data);
      }
    },
    
    // 构造syncRelations函数
    async syncNewMemberRelations(newId, payload) {
      try {
        // 1. 如果新增成员有配偶关系 -> 同步到现有配偶的 spouses 列表
        if (payload.spouses && payload.spouses.length > 0) {
          const mainId = payload.spouses[0];  // 已存在配偶的 ID
          const mainRes = await axios.get(`/api/family/${mainId}`);
          const existingSpouses = Array.isArray(mainRes.data.rels.spouses) 
            ? mainRes.data.rels.spouses.map(String) 
            : [];
          const updatedSpouses = Array.from(new Set([...existingSpouses, newId]));
          await axios.put(`/api/family/${mainId}`, { spouses: updatedSpouses });
        }

        // 2. 如果新增成员有子女关系 -> 表示此新增成员是作为父/母被添加
        if (payload.children && payload.children.length > 0) {
          const childId = payload.children[0];  // 已存在子女的 ID
          // 根据新增成员性别，确定更新子女的 father 或 mother 列表
          const newGender = payload.gender;
          const parentField = (newGender === 'M' ? 'father' : 'mother');
          const childRes = await axios.get(`/api/family/${childId}`);
          const existingParents = Array.isArray(childRes.data.rels[parentField]) 
            ? childRes.data.rels[parentField].map(String) 
            : [];
          const updatedParents = Array.from(new Set([...existingParents, newId]));
          await axios.put(`/api/family/${childId}`, { [parentField]: updatedParents });
        }

        // 3. 如果新增成员有 father 列表 -> 表示此新增成员是作为子女被添加，有现有父亲
        if (payload.father && payload.father.length > 0) {
          for (const parentId of payload.father) {
            const parentRes = await axios.get(`/api/family/${parentId}`);
            const existingChildren = Array.isArray(parentRes.data.rels.children) 
              ? parentRes.data.rels.children.map(String) 
              : [];
            const updatedChildren = Array.from(new Set([...existingChildren, newId]));
            await axios.put(`/api/family/${parentId}`, { children: updatedChildren });
          }
        }

        // 4. 如果新增成员有 mother 列表 -> 表示此新增成员是作为子女被添加，有现有母亲
        if (payload.mother && payload.mother.length > 0) {
          for (const parentId of payload.mother) {
            const parentRes = await axios.get(`/api/family/${parentId}`);
            const existingChildren = Array.isArray(parentRes.data.rels.children) 
              ? parentRes.data.rels.children.map(String) 
              : [];
            const updatedChildren = Array.from(new Set([...existingChildren, newId]));
            await axios.put(`/api/family/${parentId}`, { children: updatedChildren });
          }
        }
      } catch (err) {
        console.error('同步新成员关系时出错:', err);
        throw err;
      }
    }
  }
  
};
</script>

<style scoped></style>
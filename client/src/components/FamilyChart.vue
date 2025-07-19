<template>
  <div id="FamilyChart" class="f3" style="width:100%;height:900px;margin:auto;background-color:rgb(33,33,33);color:#fff;"></div>
</template>

<script>
import f3 from 'family-chart';  // npm install family-chart@0.7.0 or yarn add family-chart@0.7.0
import 'family-chart/styles/family-chart.css';
//import axios from 'axios';
     
export default {
  name: "FamilyChart",
  props:{
    data:{
      type:Array,
      required:true
    }
  },
  async mounted(){
    initChart(this.data);

    function initChart(data) {
      const f3Chart = f3.createChart('#FamilyChart', data)
        .setTransitionTime(1000)
        .setCardXSpacing(250)
        .setCardYSpacing(150)
        .setSingleParentEmptyCard(true, {label: 'ADD'})
        .setShowSiblingsOfMain(false)
        .setOrientationVertical()
    
      const f3Card = f3Chart.setCard(f3.CardHtml)
        .setCardDisplay([["first name","last name"],["birthday"]])
        .setCardDim({"width":100,"height":100,"img_width":90,"img_height":90})
        .setMiniTree(true)
        .setStyle('imageCircle')
        .setOnHoverPathToMain()
    
      
      const f3EditTree = f3Chart.editTree()
        .fixed(true)
        .setFields(["first name","last name","birthday","avatar"])
        .setEditFirst(true)
        .setCardClickOpen(f3Card)
      
      f3EditTree.setEdit()
    
      f3Chart.updateTree({initial: true})
      f3EditTree.open(f3Chart.getMainDatum())
    
      f3Chart.updateTree({initial: true})
    }
  }
};
</script>
<style></style>

<template>
  <div class="p_box">
    <div class="progress">
      <div class="progress_par" :style="{width:`${in_value}%`,backgroundColor:`${color}`}">
      </div>
    </div>
    <div class="progress_par_value">{{ parseInt(in_value) }}%</div>
  </div>
</template>

<script>
export default {
  name: "ProgressPar",
  props: {
    value: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: 'cornflowerblue'
    }
  },
  data() {
    return {
      in_value: this.value
    }
  },
  watch: {
    value(newVal) {
      if (newVal > 100) {
        this.in_value = 100;
      } else if (newVal < 0) {
        this.in_value = 0;
      } else {
        this.in_value = newVal;
      }
    },
    immediate: true
  }
}
</script>

<style scoped lang="less">
.progress {
  width: 100%;
  height: 5px;
  background: #e5e5e5;
  border-radius: 4px;
  overflow: hidden;
}

.progress_par {
  width: 0;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-image: linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
  background-size: 40px 40px;
  transition: width .6s ease;
  border-radius: 4px;
  animation: progress-bar-anim .7s linear infinite;
}

.progress_par_value {
  font-size: 10px;
  //font-weight: bold;
  //color: white;
  //margin-right: 5px;
  height: 20px;
  width: 30px;
  margin-left: 5px;
  margin-top: -8px;
}
.p_box{
  display: flex;
}

@keyframes progress-bar-anim {
  from {
    background-position: 40px 0;
  }
  to {
    background-position: 0 0;
  }
}
</style>

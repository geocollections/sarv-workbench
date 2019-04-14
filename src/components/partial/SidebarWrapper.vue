<template>
  <nav id="nav" class="navbar navbar-inverse sidebar navbar-fixed-top p-0" role="navigation">
    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
    <div class="nav-side-menu">
      <div class="brand" style="height: 56px">&ensp;</div>
      <i class="fa fa-bars fa-2x toggle-btn" data-toggle="collapse" data-target="#menu-content"></i>
      <!--<button id="open-mobile-menu" class="toggle-collapse  toggle-btn"  >-->
        <!--<i class="fa fa-bars fa-2x"></i>-->
      <!--</button>-->

      <div class="menu-list">

        <ul id="menu-content" class="menu-content collapse out">
          <slot></slot>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
    export default {
        name: "SidebarWrapper",
      date(){return {isActive:true}}
    }
</script>

<style src="../../assets/css/sidebarStyle.css"></style>
<style scoped>
  #open-mobile-menu {
    display: block;
    position: fixed;
    width: 55.5px;
    height: 55.5px;
    cursor: pointer;
    vertical-align: middle;
    background: white;
    border: 1px solid #e5e6e7;
    border-radius: 50%;
    padding: 13px 15px;
    /*margin: 0;*/
    margin-top:25rem;
    bottom: 20px;
    left: 20px;
    -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    -moz-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    z-index: 1;
  }

  nav.sidebar.active{
  margin-left: 0px;
  float: left;
  }



</style>

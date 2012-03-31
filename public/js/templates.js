window.Templates = window.Templates || (function() {

  var Templates = {};

  Templates.RankedItem = '<li data-id={{ id }}>{{ name }} - {{ rating }}</li>';


  Templates.TodayView = '\
    <div class="span4"> \
      <ol class="rankedList"></ol> \
    </div>';


  return Templates;
}).call(this);
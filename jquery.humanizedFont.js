/**
 * Humanized Font" jQuery Plugin
 * @version 1.0
 * @codepen http://codepen.io/dmgig/pen/NRKJoR
 * @author dmgig
 *
 * Minor randomization of font position. "Humanization" is a term used
 * in the music industry. It means to apply small variations to the
 * computerized timing to make it sound more "human". In this case... it
 * just sort of makes a mess of it. But its kind of a cool looking mess.
 * 
 * Because of the wrapping properties of inline-block, every word has to
 * be wrapped in a whitespace: nowrap span or else you get mid-word
 * breaks. And no one wants that.
 *
 * Performance is probably pretty lousy cause of all the spans. But you
 * can adjust the frequency which should help. Probably no one would use
 * it for article text anyway?
 *
 * @params - delta: amount to change letter
 *           chance: % chance a letter will be changed
 *
 * @todo allow users to extend css changes with their own
 * @todo allow list of specific letters to be humanized
 *
 */
(function($){
  
  $.fn.humanizedFont = function(options){
    
    var $Hf    = $(this);
    var chance = options.chance;
    var d      = options.delta;
 
    var position = function(delta, fontSize){
      var val = getRandom(-d,d).toFixed(2);
      val = (val * fontSize)/10;
      return val;
    }
 
    var rotate = function(delta){
      var val = getRandom(-d,d).toFixed(2);
      return val*50;
    }
    
    var scale = function(){
      var val = getRandom(.85, 1.15).toFixed(2);
      return val;
    }
    
    // build individual character tags, skip whitespace obvs
    var randomSelection = function(chance, str){
      var arr = [], isintag = false;
      
      for(var i=0; i < str.length; i++){
        // when you find a '<' stop tracking now
        // when you find a '>' start tracking on the next character.
        if(isintag){
          if(str[i] == '>')
            isintag = false;
          continue;
        }
        
        if(str[i] == '<'){
          isintag = true;
          continue;
        }     
        if(Math.random() < chance && str[i] != ' ')
          arr.push(i);
      }   
      return arr;
    }
    
    $.each($Hf, function(i, el){
 
      el = $(el);
      
      var text = el.html().trim();
      var fontSize = parseInt(el.css('font-size'));

      // surround words in nowrap spans. 
      var newtext = [];
      var text = text.split(" ");
      $.each(text, function(i, word) {
          newtext.push('<span style="white-space: nowrap;">'+word+'</span>');
      }); 
      text = newtext.join(' ');
      
      // choose letters
      var arr = randomSelection(chance, text);

      // attach styles
      var index = 0;
      for(var i=0; i < arr.length; i++){
        
        index = index + arr[i];

        var style = {
          'left': position(d, fontSize)+'px',
          'top' : position(d, fontSize)+'px',
          'transform': 'rotate('+rotate(d)+'deg) scale('+scale()+')'
        }

        var span = $('<span>'+text[index]+'</span>')
          .css(style)
          .prop("outerHTML");
        
        text = spliceSlice(text, index, 1, span);
        index = index - arr[i] - 1 + span.length;
      }
      el.html(text); 
    });
  }
  
  // @http://stackoverflow.com/questions/20817618/is-there-a-splice-method-for-strings
  function spliceSlice(str, index, count, add) {
    if (index < 0) {
      index = str.length + index;
      if (index < 0) index = 0;
    }
    return str.slice(0, index) + (add || "") + str.slice(index + count);
  }

  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }  
  
})(jQuery);


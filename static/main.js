var enter = false;

function makeAnim(){
    $('#start').click(function(){
        console.log('s')
        $('.pseudo').addClass('HnS');
    })
}

function clickOnColor(){
    $('.part').mouseover(function(){
        enter = true;
        var id = $(this).attr('id');
        console.log(typeof(id));
        var color = $(this).css('background-color');
        $('.pseudo').addClass('HnS');

        setTimeout(function(){
            $('.orig h1').text(id);
            $('.orig p').text('');
            $('.orig').css('color',color);
        },300);

        setTimeout(function(){
            $('.pseudo').removeClass('HnS');
            // $('.orig h1').text('Miroslav Baláž');
            // $('.origin p').text('since 1997');
        },600)
    })

    $('.part').mouseleave(function(){
        setTimeout(function(){
            if ( !checkHover() ) {
                $('.pseudo').addClass('HnS');
                
                setTimeout(function(){
                    $('.orig').css('color','rgb(67,158,146)')        
                    $('.orig h1').text('Miroslav Baláž');
                    $('.orig p').text('since 1997');
                },250)
            
                setTimeout(function(){
                    $('.pseudo').removeClass('HnS');
                },500)
            }
        },400)
    })
    
}

function checkHover(){
    for ( var x = 0; x < document.getElementsByClassName('part').length; x++) {
        var partOf = document.getElementsByClassName('part');
        if ( $(partOf[x]).is(':hover') ){
            return true;
        }
    }
    return false;
}
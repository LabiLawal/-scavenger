var fs = require ("fs");
var bodyParser = require('body-parser');
var urlencodedparser = bodyParser.urlencoded({extended: false});

function getEstSales(){ return (Math.random() * 10 ) * ( Math.random() * 100 );}

var links = [];
var arrlen = links.length;
module.exports = (app, request, xray, session, path)=>{

    app.get("/login", (req, res)=>{

        if(req.session.email){
            res.redirect('/search');    
        }else{
            res.render('login'); 
        }
        
   
    });
    app.get('/search',(req, res)=>{
        res.render("index", {num : arrlen,
                            data : links}); 
    }) 
    
    app.post('/login', urlencodedparser, (req, res)=>{
       req.session.email = req.body.email;
       req.session.password = req.body.password;
       if(req.session.email != null && req.session.password != null ) res.redirect('/search');
       else  res.redirect('/login');
    });

     app.post("/search", urlencodedparser, (req, res)=>{

        var url = 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=' + req.body.product;
        console.log(url);

        //search amazon for the specific product and get the url's of every product listed.
        /*
          using xray -> a node module wriiten by the founder of cheerio,
            >import it to the express app,
            >create an instance with the new constructor,
            >xray('url', 'selector', 'object')(function(err, results){
                do something with results.....
            })
         */

            xray(url,'div.a-fixed-left-grid-col.a-col-right', [{
                         category: xray('a.s-access-detail-page@href','span[class="nav-a-content"]'),
                         estSales: getEstSales(),
                         link: 'div.a-row.a-spacing-none >a.s-access-detail-page@href',
                         price: 'span.sx-price.sx-price-large>span.sx-price-whole',
                         seller: 'span.a-size-small.a-color-secondary>a',
                         rating: 'i[class="a-icon a-icon-star a-star-4-5"]>span[class="a-icon-alt"]',
                         name : 'h2[data-attribute]'
                         
                         

                }])((err, obj)=>{
                    if(err) {
                        console.log("there is an error:")
                        console.log(err);
                        res.redirect('/search');
                        
                    }else{   
                        while(obj){
                        
                           if (links.push(obj)){ break; }                         
                        }
                        res.redirect('/search');
                    }
                })
                .paginate('div[id="bottomBar"]>div#pagn.pagnHy>span.pagnLink');

})
}
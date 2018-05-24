var fs = require ("fs");
var bodyParser = require('body-parser');
var urlencodedparser = bodyParser.urlencoded({extended: false});


module.exports = (app, request, xray)=>{

    app.get("/", (req, res)=>{
        res.render("index");    
    });

     app.post("/search", (req, res)=>{

        var links = [];

        //search amazon for the specific product and get the url's of every product listed.
        /*
          using xray -> a node module wriiten by the founder of cheerio,
            >import it to the express app,
            >create an instance with the new constructor,
            >xray('url', 'selector', 'object')(function(err, results){
                do something with results.....
            })
         */
        xray('https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords' + req., 'div.a-row.a-spacing-none', {
            link: 'a.s-access-detail-page@href',
         })(function(err, results) {
                if(links.push(results)){
                getName();
                }   
        })
          .paginate('span.pagnLink a@href') 
          .limit(1)
          .write('results.json');
        
          function getName(){
              if(links != null ){
              
              xray(links[0], 'span#priceblock_ourprice', [{
          
                price:'span[class=buyingPrice]'
        
          }])(function(err, results){
            console.log(results);
         })
            }else{
                    console.log("couldn't get data...\n Check your internet connection.");
                }
        }
    
     }); 
 

} 
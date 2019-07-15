var url=require('url');
var mysqljs = require('../../../mysql.js');
var mysql=require('mysql');
var cookie=require('../../../cookie.js');
var youtube=require('../../../youtube.js');
var disableprotection=process.env.disable_protection=="true";
function insertSong(res,req,_songqueueData,_youtubeData){//youtubeData will have id, titile, length, views, likeCount, dislikeCount
    
    /*
    songqueueData will have requestedBy, channel
    todo list add other fields:
    length
    views
    likeCount
    dislikeCount
    */
       let channel=_songqueueData.channel;
       let  requestedBy=_songqueueData.requestedBy;
       let  songURL="https://www.youtube.com/watch?v="+_youtubeData.id;
       let title=_youtubeData.title;
       let length=_youtubeData.length;
       let views=_youtubeData.views;
       let  likeCount=_youtubeData.likeCount;
       let  dislikeCount=_youtubeData.dislikeCount;
        console.log("Id"+_youtubeData.id)
        console.log(_songqueueData);
        console.log(_youtubeData);
        
        
        
        
        
        
                mysqljs.tableExists(channel+"_songList",function(_tableExists){
                    if(_tableExists){
                       console.log("table exists");
                       console.log("requestedBy: "+requestedBy);
                       console.log("title "+title);
                       console.log("url "+songURL);
                        if(requestedBy && title && songURL)
                        {
                           let URL=url.parse(songURL);
                            if(URL.host=="youtube.com" || URL.host=="www.youtube.com"){
                                if(requestedBy==cookie.getCookie(req,"nick")||disableprotection){
                                    if(requestedBy!=cookie.getCookie(req,"nick")&&disableprotection)
                                    {
                                        console.warn("User permissions override setting allowed "+cookie.getCookie(req,"nick")+" access to a restricted function that would have otherwise been denied.");
                                    }
                            console.log("attempting to insert data");
                            var channel=getQuery(req,"channel")
                            mysqljs.getQueue(channel,function(_queue){
                                console.log("queue,requestedBy,title,songURL");
                            console.log(_queue+","+requestedBy+","+title+","+songURL);
                            mysqljs.insertIntoTable(channel+"_songList","queue,requestedBy,title,length,views,likeCount,dislikeCount,songURL",[[_queue,requestedBy,title,length,views,likeCount,dislikeCount,songURL]],function(_success){
                                if(_success){
                res.writeHead(200,{"Content-Type":"text/plain"});
                res.write("Song added.");
                res.end();
                                }
                                else{
                res.writeHead(500,{"Content-Type":"text/plain"});
                res.write("server error");
                res.end();
                                }
        
                            });
                        });
                    }
                    else
                    {
                        console.log("Return forbidden 403, not authorized.");
                        res.writeHead(403,{"Content-Type":"text/plain"});
                        res.write("Forbidden user not authorized.");
                        res.end();
                    }
                    }
                    else{
                        console.log("Host: '"+songURL.host+"' is not supported");
                        res.writeHead(400,{"Content-Type":"text/plain"});
                        res.write("Host: '"+songURL.host+"' is not supported.");
                        res.end();
                    }
                        }
                        else{
                            res.writeHead(400,{"Content-Type":"text/plain"});
                            res.write("Error: Your request is malformed.");
                            res.end(); 
                        }
                    }
                    else
                    {
                        console.log("table does not exist");
                        res.writeHead(400,{"Content-Type":"text/plain"});
                        res.write("Error: the songlist for this channel could not be found. Please double check your request, or contact the site administrator.");
                        res.end();
                    }
                });// */
        

}
function getQuery(req,query,equals){
    query=query.toLowerCase();
    let urlQuery=url.parse(req.url,true).query;
    let searchQuery=JSON.parse(JSON.stringify(urlQuery).toLowerCase());
    if(searchQuery[query]){
        let  temp="";
        for(let i=0;i<query.length;i++){
    temp+=JSON.stringify(urlQuery)[JSON.stringify(searchQuery).search(query)+i];
        }
        if(equals){
            return urlQuery[temp].toLowerCase()==equals.toLowerCase();
        }
        return urlQuery[temp];
    }
    
    else return false;
}
exports.start=function(req,res){
    console.log("songqueue"); 
    if(getQuery(req,"request","addTable"))
    {
        if(getQuery(req,"user")==cookie.getCookie(req,"nick")||disableprotection){
            if(getQuery(req,"user")!=cookie.getCookie(req,"nick") && disableprotection){
                console.warn("User permissions override setting allowed "+cookie.getCookie(req,"nick")+" access to a restricted function that would have otherwise been denied.");
            }
mysqljs.createSongRequestTable(getQuery(req,"user"));
res.writeHead(200,{"Content-Type":"text/plain"});
res.write("Table added");
res.end();
        }
        else
        {
            res.writeHead(403,{"Content-Type":"text/plain"});
            res.write("Access forbidden: you are either not logged in or your request is malformed.");
            res.end();
        }
    }
    else
    if(getQuery(req,"request","insertSong")&& getQuery(req,"channel") && req.method=="POST"){

       console.log(req.body);
        if(req.body["requestedBy"]==cookie.getCookie(req,"nick")||disableprotection){
            if(req.body["requestedBy"]!=cookie.getCookie(req,"nick")&&disableprotection){
                console.warn("User permissions override setting allowed "+cookie.getCookie(req,"nick")+" access to a restricted function that would have otherwise been denied.");
            }
            if(req.body["url"]){
                let url=req.body["url"];
                youtube.getVideoDetails(url,function(_data){
                    let songdata={"channel":getQuery(req,"channel"),"requestedBy":req.body["requestedBy"]};
                    insertSong(res,req,songdata,_data);
                });
            }
                else
                if(req.body["title"]){
                    youtube.getVideoURL(req.body["title"],function(url){
                        youtube.getVideoDetails(url,function(_data){
                            let songdata={"channel":getQuery(req,"channel"),"requestedBy":req.body["requestedBy"]};
                            insertSong(res,req,songdata,_data);
                        });
                    });
                }
            }
            else{
                        res.writeHead(403,{"Content-Type":"text/plain"});
                        res.write("Forbidden user not authorized.");
                        res.end();
            }
        }
        
    else
    if(getQuery(req,"request","popfromqueue") && getQuery(req,"channel") && req.method=="POST"){
       
       console.log(cookie.getCookie(req,"nick")+"=="+getQuery(req,"channel"))
       if(cookie.getCookie(req,"nick")==getQuery(req,"channel")||disableprotection){
        if(getQuery(req,"channel")!=cookie.getCookie(req,"nick") && disableprotection){
            console.warn("User permissions override setting allowed "+cookie.getCookie(req,"nick")+" access to a restricted function that would have otherwise been denied.");
        }
        mysqljs.popFromQueue(getQuery(req,"channel"),function(){
            res.writeHead(200,{"Content-Type":"text/plain"});
            res.write("success");
            console.log("pop from queue successful.");
            res.end();
        });
       
       }
       else{
        res.writeHead(403,{"Content-Type":"text/plain"});
        res.write("Error: Request is forbidden");
        res.end(); 
       }
    }
    else
    if(getQuery(req,"request","getSongs"))
    {
        if(getQuery(req,"channel")){
            mysqljs.getSongs(getQuery(req,"channel"),function(songs){
                res.writeHead(200,{"Content-Type":"application/json"});
                res.end(JSON.stringify(songs));
            });
        console.log("dummy function to get song list");

       
        
        }
        else{
            res.writeHead(400,{"Content-Type":"text/plain"});
            res.write("Error: request is malformed.");
            res.end() 
        }
    }
    else
    if(getQuery(req,"request","deleteSong") && req.method=="POST")
    {
         if(req.body["requestedBy"] && req.body["queue"] && getQuery(req,"channel")){
             var deleteInitiatedBy=req.body["requestedBy"];
             //initiated 
             var deleteQueue=req.body["queue"];
             var channel=getQuery(req,"channel");
             mysqljs.getQueue(channel,function(queue){
                
                if(deleteQueue<queue && deleteQueue>0){
             mysqljs.getRequesterFromQueue(channel,deleteQueue,function(requestedBy){
             if(deleteInitiatedBy==cookie.getCookie(req,"nick") && ((deleteInitiatedBy==channel||deleteInitiatedBy==requestedBy))||disableprotection)
             {
                if(disableprotection&&(deleteInitiatedBy=cookie.getCookie(req,"nick") && (deleteInitiatedBy==channel||deleteInitiatedBy==requestedBy)==false))
                {
                    console.warn("User permissions override setting allowed "+cookie.getCookie(req,"nick")+" access to a restricted function that would have otherwise been denied.");
                    deleteInitiatedBy=requestedBy;
                }
             mysqljs.deletefromQueue(channel,deleteInitiatedBy,deleteQueue,function(_success){
                 if(_success)
                 {
                    res.writeHead(200,{"Content-Type":"text/plain"});
                    res.write("success");
                    res.end();
                 }
             });
             }
             else
             {
                res.writeHead(403,{"Content-Type":"text/plain"});
                res.write("Error: request is forbidden.");
                res.end();
             }
            });
             }
             else{
                res.writeHead(400,{"Content-Type":"text/plain"});
                res.write("Error: song in queue could not be deleted");
                res.end();  
             }
        });

         }
         else{
            res.writeHead(400,{"Content-Type":"text/plain"});
            res.write("Error: request is malformed.");
            res.end();
         }
    }
    else{
        res.writeHead(404,{"Content-Type":"text/plain"});
        res.write("Error: page is not found.");
        res.end();
    }
    


} 
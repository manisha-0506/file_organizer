#!/usr/bin/env node
let input = process.argv.slice(2);
let fs= require("fs");
let path=require("path");
let destPath;
let command=input[0];
let types={
    media : ['mp4','mp3','mkv'],
    archieves : ['zip' , '7z','rar','tar','gz','ar','iso',"xz"],
    documents : ['docx' , 'doc','pdf','xlsx','xls','odt','ods','odp','odg','odf','txt','ps','tex'],
    app : ['exe','dmg','pkg',"deb"]
}
    switch(command)
    {
        case "tree":
        treefn(input[1]);
        break;
        case "organize":
        organizefn(input[1]);
        break;
        case "help":
        helpfn();
        break;
        deafault:
        console.log("Enter correct command");

    }
    function treefn(dirPath)
    {
        console.log("tree",dirPath);
        if(dirPath==undefined){
            treeHelper(process.cwd()," ");
            return;
            }
            else{
                  let doesPath=fs.existsSync(dirPath);
                   if(doesPath)
                   {
                    treeHelper(dirPath," ");
                   }
                    else{
                        console.log("Kindly enter correct path");
                        return;
                    }
                }


    }
    function treeHelper(dirPath,indent)
    {
        let isFile=fs.lstatSync(dirPath).isFile();
        if(isFile==true)
        {
            let fileName=path.basename(dirPath);
            console.log(indent + "----"+fileName);
        }
        else
        {
            let dirName=path.basename(dirPath);
            console.log(indent + "----"+dirName);
            let childrens=fs.readdirSync(dirPath);
            for(let i=0;i<childrens.length;i++)
            {
               let childPath= path.join(dirPath,childrens[i]);
               treeHelper(childPath,indent+"\t");

            }

        }
    }
    function organizefn(dirPath)
    {
         console.log("organize",dirPath);
         if(dirPath==undefined){
         destPath=process.cwd();
         return;
         }
         else{
              let  doesPath=fs.existsSync(dirPath);
                if(doesPath)
                {
                     destPath=path.join(dirPath,"orgaized_files");
                    if(fs.existsSync(destPath)==false){
                    fs.mkdirSync(destPath);
                    }

                }
                else{
                console.log("Enter correct Path");
                return;
                }
            
         }
         organizeHelper(dirPath,destPath);
    }
    function organizeHelper(src,dest)
    {
        let childNames = fs.readdirSync(src);
       // console.log(childNames);
       for(i=0;i<childNames.length;i++)
       {
          let childAddress=path.join(src,childNames[i]);
          let isFile=fs.lstatSync(childAddress).isFile();
          if(isFile)
          {
            let category=getCategory(childNames[i]);
            console.log(childNames[i],"belongs to --",category);
            //copy
            sendFiles(childAddress , dest ,category);

          }
       }
    }
    function sendFiles(srcFilePath,dest ,category)
    {
        let categoryPath=path.join(dest,category);
        if(fs.existsSync(categoryPath)==false)
        {
            fs.mkdirSync(categoryPath);
        }
        let fileName=path.basename(srcFilePath);
        let destFilePath = path.join(categoryPath, fileName);
        fs.copyFileSync(srcFilePath,destFilePath);
        console.log(fileName,"copied to",category);
    }
    function getCategory(name)
    {
        let ext =path.extname(name);
        ext=ext.slice(1);
        for(let type in types)
        {
            let ctype=types[type];
            for(let i=0;i<ctype.length;i++)
            {
                if(ctype[i]==ext){
                return type;}
            }
        }
        return "others";
       // console.log(ext);
    }
    function helpfn()
    {
        console.log("HELP");
    }

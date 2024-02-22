async function decrypt(folder, file) {
    console.log("Lecture du fichier : " + folder + file);
    cheminFichier = folder +"/"+file;
    document.getElementById('content').innerHTML = "";
    try {
        var codeblock = false;
        var language = "";
        var code_content=[]
        var nbCodeBlock=0;
        const reponse = await fetch(cheminFichier);
        const texte = await reponse.text();
        const lignes = texte.split('\n');
        lignes.forEach(function(ligne) {
            //on commence par verifier que la ligne ne correspond pas à un codeblock
            if(ligne.substring(0,3)=="```" && codeblock == false){
                nbCodeBlock++;
                language = ligne.substring(3);
                codeblock = true;
                console.log("nouveau codeblock trouvé avec pour language :"+language);
            }else if(ligne[2]=="`" && codeblock == true){ // le cas ou l'on quittte le code block
                codeblock = false;
                document.getElementById('content').innerHTML += "<div class=\"code\"><div class=\"code_header\"><div class=\"circle\" id=\"red\"></div><div class=\"circle\" id=\"orange\"></div><div class=\"circle\" id=\"green\"></div><h2 id=\"lang"+nbCodeBlock+"\">Python</h2></div><div id=\"code_content"+nbCodeBlock+"\" class=\"code_content\"></div></div>";
                document.getElementById("lang"+nbCodeBlock).innerHTML=language; //on change le language du codeblock
                for(var i = 0; i<code_content.length; i++){
                    document.getElementById("code_content"+nbCodeBlock).innerHTML += "<pre>"+code_content[i]+"</pre>";
                }
                console.log("fin du codeblock"+code_content);
            }
            if (codeblock){//si la ligne est un codeblock, on l'ajoute à la liste des lignes du codeblock
                if (ligne.substring(0,3)!="```"){
                    code_content.push(ligne);
                }
            }else{
                var count =0;
                for (let i = 0; i < ligne.length; i++) {
                    if ((ligne[i] == '#') && i<6) {
                        count++;
                        console.log('Titre : ' + ligne);
                    }
                }
                if (count == 0) {
                    ligneToAppend="<p>"+ligne+"</p>";
                }
                else{
                    ligneToAppend="<h"+count+">"+ligne.substring(count) + '</h'+count+">";   //ligne.substring(count) c'est pour enlever les # devant les titres
                }
                nbquote = [0,0]
                for (let i = 0; i < ligne.length; i++) {
                    if (ligne[i]== "\`"){
                        if(nbquote[0] == 0){
                            nbquote[0]=i;
                        }else{
                            nbquote[1]=i;
                            ligneToAppend = ligneToAppend.substring(0, nbquote[0]+1) + "<span class=\"bold\">" +ligne.substring(nbquote[0]+1,nbquote[1]) + "</span>" + ligne.substring(nbquote[1]+1);
                            console.log(ligneToAppend)
                            console.log(ligne.substring(nbquote[0]+1,nbquote[1]))
                            nbquote = [0,0]

                        }
                    }
                }
                document.getElementById('content').innerHTML += ligneToAppend;
            }
            
        });
    } catch (erreur) {
        console.error('Une erreur s\'est produite lors de la lecture du fichier :', erreur);
    }
}
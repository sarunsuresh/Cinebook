const Movie=require('../models/movie')

async function addMovie(data){
    const title=data.title
    const duration=data.duration
    const language=data.language
    const genre=data.genre
    const releaseStatus=data.releaseStatus
    let result;
    try{

     result=await Movie.create({
        title:title,
        duration:duration,
        language:language,
        Genre:genre,
        ReleaseStatus:releaseStatus

    })
}
catch(err){
    console.log("error",err);
    
}

    
return result
}

module.exports={
    addMovie

}
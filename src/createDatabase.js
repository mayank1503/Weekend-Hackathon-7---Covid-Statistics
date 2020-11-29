const { connection } = require('./connector')
const { data } = require('./data')

const refreshAll = async () => {
    await connection.deleteMany({});
    // console.log(connection)
    await connection.insertMany(data);
}
refreshAll().then(_=>console.log("Successfully uploaded")).catch((err)=>console.log("error occurred",err));
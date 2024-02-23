import {connect} from 'mongoose'
import { mongodb_uri } from './config'; 

( async() => {
  try {
    const db = await connect(mongodb_uri)
    console.log('DB connected to', db.connection.name)
  } catch (error) {
    console.log(error);
  }
})();
import { PrismaClient } from '@prisma/client'
import  moment from 'moment'

const prisma = new PrismaClient()
export default async ( params, resp) => {
  const {query, method} = params;
  const {start_date, end_date} = query;
  if (method === 'GET'){
    if (start_date && end_date){
      const sql = `select u.id, u.name, P.release_at from  "User" u inner join "Purchase" P on u.id = P."userId"
      inner join "Purchase_Product" PP on P.id = PP.purchase_id inner join "Product" P2 on P2.id = PP.product_id      
      where P2.name like '%Leite%' and P.release_at between '${start_date}' and '${end_date}' GROUP BY u.id, u.name, P.release_at HAVING SUM(P2.price) > 30`  
      const res = await prisma.$queryRawUnsafe(`${sql}`);
      resp.status(200).json(res);
    } else {
      resp.status(400).json({success: false, message: "Erro ao realizar busca por data."})
    }
  }
  
}
import { PrismaClient } from '@prisma/client'
import  moment from 'moment'

const prisma = new PrismaClient()
export default async ( params, resp) => {
  const {query, method} = params;
  const {start_date, end_date} = query;
  if (method === 'GET'){
    if (start_date && end_date){
      const sql = `Select u.id, u.name, P.release_at from  "User" u inner join "Purchase" P on u.id = P."userId"
      inner join "Purchase_Product" PP on P.id = PP.purchase_id inner join "Product" P2 on PP.product_id = P2.id
      where P.id in (
          select P.purchase_id
          from "Purchase_Product" P inner join "Product" P2 on P2.id = P.product_id
          group by P.purchase_id Having SUM(P2.price) > 30 and count(P.product_id) >= 3
      ) and P.release_at between '${start_date}' and '${end_date}' and P2.name like '%Leite%' group by u.id, u.name, P.release_at`;
      const res = await prisma.$queryRawUnsafe(`${sql}`);
      resp.status(200).json(res);
    } else {
      resp.status(400).json({success: false, message: "Erro ao realizar busca por data."})
    }
  }
  
}
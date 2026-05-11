// import {
//   Injectable,
//   NestMiddleware,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import * as jwt from 'jsonwebtoken';
// import jwksClient = require('jwks-rsa');


// const TENANT_ID = process.env.TENANT_ID;
// const CLIENT_ID = process.env.CLIENT_ID;

// console.log('TENANT_ID:', TENANT_ID);
// console.log('CLIENT_ID:', CLIENT_ID);
// console.log('JWKS URI:', `https://login.microsoftonline.com/${TENANT_ID}/discovery/v2.0/keys`);

// const client = jwksClient({
//   jwksUri: `https://login.microsoftonline.com/${TENANT_ID}/discovery/v2.0/keys`,
// });

// function getKey(header: any, callback: any) {
//   client.getSigningKey(header.kid, function (err, key: any) {
//     if (err) {
//       return callback(err);
//     }
//     const signingKey = key.getPublicKey();
//     callback(null, signingKey);
//   });
// }

// @Injectable()
// export class AuthMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     const authHeader = req.headers['authorization'];

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       throw new UnauthorizedException('Token no proporcionado o malformado');
//     }

//     const token = authHeader.split(' ')[1];
//     const decodedPreview = jwt.decode(token, { complete: true });
//     console.log('Token decodificado (sin verificar):', JSON.stringify(decodedPreview, null, 2));

//     jwt.verify(
//       token,
//       getKey,
//       {
//         algorithms: ['RS256'],
//         audience: CLIENT_ID,
//         issuer: `https://login.microsoftonline.com/${TENANT_ID}/v2.0`,
//       },
//       (err, decoded) => {

//         console.log('Token decodificado:', decoded);
//         if (err) {
//           console.error('Error al verificar el token:', err.message);
//           throw new UnauthorizedException('Token inválido');
//         }
//         console.log('Token verificado por middleware:', decoded);

//         req['user'] = decoded;
//         next();
//       },
//     );
//   }
// }




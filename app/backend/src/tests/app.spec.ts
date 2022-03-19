import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/User'
import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Request POST method to route "/login"', async () => {
  describe('when requested successfully', async () => {
    let chaiHttpResponse: Response;

    const loginBody = {
      email: "admin@admin.com",
      password: "admin"
    }

    const loginReturn = {
      "id": 1,
      "username": "Admin",
      "role": "admin",
      "email": "admin@admin.com"  
    }

    before(async () => {
      sinon
        .stub(User, "findOne")
        .resolves(loginReturn as User);
    });

    after(()=>{
      (User.findOne as sinon.SinonStub).restore();
    })

    it('reponse body is an object ', async () => {
      chaiHttpResponse = await chai
          .request(app)
          .post('/login')
          .send(loginBody)

      expect(chaiHttpResponse.body).to.be.an('object');
    });

    it('response body has properties "user" and "token" ', async () => {
      chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send(loginBody)

      expect(chaiHttpResponse.body).to.have.all.keys('user', 'token');
    });

    it('"user" has properties "id", "username", "role" and "email" ', async () => {
      chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send(loginBody)

      expect(chaiHttpResponse.body.user).to.have.all.keys('id', 'username', 'role', 'email');
    });

    it('"token" is a string', async () => {
      chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send(loginBody)

      expect(chaiHttpResponse.body.token).to.be.a('string');
    })
  })
});

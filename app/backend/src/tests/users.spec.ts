import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http') 

import { app } from '../app';
import User from '../database/models/User'
import { Response } from 'superagent';
import { Model } from 'sequelize/types';

chai.use(chaiHttp);

const { expect } = chai;

describe('Request POST method to route "/login"', async () => {

  let chaiHttpResponse: Response;
  const loginBody = {
    email: "admin@admin.com",
    password: "secret_admin"
  }

  const invalidBody = {
    email: "admin@admin.com",
  }

  const userReturned = {
    "id": 1,
    "username": "Admin",
    "role": "admin",
    "email": "admin@admin.com",
    "password": "$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW"
  }
  
  describe('when user exists', async () => {


    before(async () => {
      sinon
        .stub(User, "findOne")
        .resolves(userReturned as unknown as Model);
      
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send(loginBody);  
    });

    after(()=>{
      (User.findOne as sinon.SinonStub).restore();
    })

    it('reponse body is an object ', async () => {
      
      expect(chaiHttpResponse.body).to.be.an('object');
    });

    it('response body has properties "user" and "token" ', async () => {

      expect(chaiHttpResponse.body).to.have.all.keys('user', 'token');
    });

    it('"user" has properties "id", "username", "role" and "email" ', async () => {

      expect(chaiHttpResponse.body.user).to.have.all.keys('id', 'username', 'role', 'email');
    });

    it('"token" is a string', async () => {

      expect(chaiHttpResponse.body.token).to.be.a('string');
    })
  })

  describe("when email, or password, is invalid", async () => {
    
    before(async () => {
      sinon
        .stub(User, "findOne")
        .resolves(undefined);
      
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send(loginBody);  
    });
      
    after(()=>{
      (User.findOne as sinon.SinonStub).restore();
    });

    it('return an object', async () => {

      expect(chaiHttpResponse.body).to.be.an('object');
    });

    it('the object contains a property message', async () => {

      expect(chaiHttpResponse.body).to.have.key('message');
    });

    it('the message is "Incorrect email or password"', async () => {

      expect(chaiHttpResponse.body.message).to.be.equal("Incorrect email or password");
    });

    it('the http code is 401', async () => {
      expect(chaiHttpResponse.status).to.be.equal(401)
    })
  });

  describe("when body request email is null", async () => {
    before(async () => {   
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send(invalidBody);  
    });

    it('return an object', async () => {

      expect(chaiHttpResponse.body).to.be.an('object');
    });

    it('the object contains a property message', async () => {

      expect(chaiHttpResponse.body).to.have.key('message');
    });

    it('the message is "All fields must be filled"', async () => {

      expect(chaiHttpResponse.body.message).to.be.equal("All fields must be filled");
    });

    it('the http code is 401', async () => {
      expect(chaiHttpResponse.status).to.be.equal(401)
    })      
  });

  describe("when body request password is null", async () => {
    before(async () => {   
      chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send(invalidBody);  
    });

    it('return an object', async () => {

      expect(chaiHttpResponse.body).to.be.an('object');
    });

    it('the object contains a property message', async () => {

      expect(chaiHttpResponse.body).to.have.key('message');
    });

    it('the message is "All fields must be filled"', async () => {

      expect(chaiHttpResponse.body.message).to.be.equal("All fields must be filled");
    });

    it('the http code is 401', async () => {
      expect(chaiHttpResponse.status).to.be.equal(401)
    })      
  });
});

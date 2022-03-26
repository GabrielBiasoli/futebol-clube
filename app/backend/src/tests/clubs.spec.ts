import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';
import Club from '../database/models/Club'
import { Response } from 'superagent';
import { Model } from 'sequelize/types';
import clubs = require('./data/clubs.json')

describe('Request GET method to route "/clubs" ', async () => {
  describe('when clubs exist in database ', async () => {

    it('return an array ', async () => {

    })
  })
})

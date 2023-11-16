import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from '@jest/globals';
import useSWR from 'swr';
import SingleApplicantView from '../../../src/pages/SingleApplicantView'; 
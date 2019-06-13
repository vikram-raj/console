import * as yup from 'yup';
import { convertToBaseValue, units } from './../../../../components/utils';

const urlRegex = /^(((ssh|git|https?):\/\/[\w]+)|(git@[\w]+.[\w]+:))([\w\-._~/?#[\]!$&'()*+,;=])+$/;

export const convertValueToBase = (value: number, unitLabel: string) => {
  let val: number;
  switch (unitLabel) {
    case 'millicores':
      val = convertToBaseValue(`${value} m`);
      break;
    case 'MiB':
      val = units.dehumanize(`${value}MiB`, 'binaryBytes').value;
      break;
    case 'GiB':
      val = units.dehumanize(`${value}GiB`, 'binaryBytes').value;
      break;
    case 'MB':
      val = units.dehumanize(`${value}MB`, 'decimalBytes').value;
      break;
    case 'GB':
      val = units.dehumanize(`${value}GB`, 'decimalBytes').value;
      break;
    default:
      val = value;
      break;
  }
  return val;
};

export const validateLimit = (min: number, max: number, unitOfMin: string, unitOfMax: string) => {
  const minInBase = convertValueToBase(min, unitOfMin);
  const maxInBase = convertValueToBase(max, unitOfMax);
  if (maxInBase < minInBase) {
    return `Limit can't be less than request (${min} ${unitOfMin}).`;
  }
};

export const validationSchema = yup.object().shape({
  name: yup.string().required('Required'),
  project: yup.object().shape({
    name: yup.string().required('Required'),
  }),
  application: yup.object().shape({
    name: yup.string().required('Required'),
    selectedKey: yup.string().required('Required'),
  }),
  image: yup.object().shape({
    selected: yup.string().required('Required'),
    tag: yup.string().required('Required'),
  }),
  git: yup.object().shape({
    url: yup
      .string()
      .matches(urlRegex, 'Invalid Git URL')
      .required('Required'),
    type: yup.string().when('showGitType', {
      is: true,
      then: yup.string().required('We failed to detect the git type. Please choose a git type.'),
    }),
    showGitType: yup.boolean(),
  }),
  deployment: yup.object().shape({
    replicas: yup
      .number()
      .integer('Replicas must be an Integer')
      .min(0, 'Replicas must be greater than or equal to 0.')
      .test({
        name: 'isEmpty',
        test: (value) => value !== undefined,
        message: 'This field cannot be empty',
      }),
  }),
  resourceLimit: yup.object().shape({
    cpuRequest: yup.object().shape({
      request: yup
      .number()
      .integer('Request must be an Integer')
      .min(0, 'Request must be greater than or equal to 0.'),
    requestUnit: yup.string('Unit must be millicores or cores')
    }),
    cpuLimit: yup.object().shape({
      limit: yup
        .number()
        .integer('Limit must be an Integer')
        .min(0, 'Limit must be greater than or equal to 0.'),
      limitUnit: yup.string('Unit must be millicores or cores')
    }),
    memoryRequest: yup.object().shape({
      request: yup
        .number()
        .integer('Request must be an Integer')
        .min(0, 'Request must be greater than or equal to 0.'),
      requestUnit: yup.string('Unit must be Mib or Gib or Mb or GB')
    }),
    memoryLimit: yup.object().shape({
      limit: yup
        .number()
        .integer('Limit must be an Integer')
        .min(0, 'Limit must be greater than or equal to 0.'),
      limitUnit: yup.string('Unit must be Mib or Gib or Mb or GB')
    }),
  }),
});

export const detectGitType = (url: string): string => {
  if (!urlRegex.test(url)) {
    return;
  }
  if (url.includes('github.com')) {
    return 'github';
  } else if (url.includes('bitbucket.org')) {
    return 'bitbucket';
  } else if (url.includes('gitlab.com')) {
    return 'gitlab';
  }
  return '';
};
const rules = {
  Url:
    '^https?:\\/\\/(([a-zA-Z0-9_-])+(\\.)?)*(:\\d+)?(\\/((\\.)?(\\?)?=?&?[a-zA-Z0-9_-](\\?)?)*)*$',
  Email: '\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*',
  Phone: '^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$',
  ID:
    '^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[Xx])$)$',
  OnlyEn: '^[a-zA-Z]+$',
  TwoDecimal: '^([1-9][0-9]*)+(.[0-9]{1,2})?$',
  StrongPwd: '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$',
};

export default {
  [rules.Email]: {
    title: '邮箱',
    message: '不是正确的邮箱格式',
  },
  [rules.Url]: {
    title: 'url地址',
    message: '不是正确的url地址格式',
  },
  [rules.Phone]: {
    title: '电话号码',
    message: '不是正确的电话号码格式',
  },
  [rules.ID]: {
    title: '身份证',
    message: '不是正确的身份证格式',
  },
  [rules.OnlyEn]: {
    title: '英文字母',
    message: '不是正确的英文字母格式',
  },
  [rules.TwoDecimal]: {
    title: '两位小数',
    message: '不是正确的两位小数格式',
  },
  [rules.StrongPwd]: {
    title: '强密码',
    message: '必须包含大小写字母和数字的组合，不能使用特殊字符，长度在8-10之间',
  },
};
const getEmailValue = (value) => {
  const email = value?.substring(1, value.length - 1);
  return email;
};

export { getEmailValue };

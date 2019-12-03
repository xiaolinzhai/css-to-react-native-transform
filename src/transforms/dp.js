export const dpToStr = value => {
  //return value;
  return value.replace(
    /(\d*\.?\d+)dp/g,
    //(match, m1) => parseFloat(m1, 10) * 16 + "px",
    (match, m1) => "pxToDp(" + parseFloat(m1, 10) + ")",
  );
};

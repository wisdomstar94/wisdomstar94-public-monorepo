export type GetTimeAgoInfoOption = {
  isMoreDetail?: boolean;
};

export function getTimeAgoInfo(date: Date, option?: GetTimeAgoInfoOption) {
  const time = date.getTime();
  if (isNaN(time)) {
    return undefined;
  }

  const nowTime = new Date().getTime();
  if (nowTime < time) {
    return undefined;
  }

  const { isMoreDetail = false } = option ?? {};

  const diffTime = nowTime - time;

  const agoSecond = Math.floor(diffTime / 1000);

  const agoMinute = Math.floor(diffTime / (1000 * 60));
  const agoMinuteRemain = diffTime % (1000 * 60);

  const agoHour = Math.floor(diffTime / (1000 * 60 * 60));
  const agoHourRemain = diffTime % (1000 * 60 * 60);

  const agoDate = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const agoDateRemain = diffTime % (1000 * 60 * 60 * 24);

  const agoYear = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
  const agoYearRemain = diffTime % (1000 * 60 * 60 * 24 * 365);

  let autoPrettyString = '';
  let detailString = '';

  if (agoMinute <= 0) {
    autoPrettyString = `${agoSecond}초 전`;
  } else if (agoHour <= 0) {
    autoPrettyString = `${agoMinute}분 전`;
  } else if (agoDate <= 0) {
    if (isMoreDetail === true) {
      detailString = `${Math.floor(agoHourRemain / (1000 * 60))}분 `;
    }
    autoPrettyString = `${agoHour}시간 ${detailString}전`;
  } else if (agoYear <= 0) {
    if (isMoreDetail === true) {
      detailString = `${Math.floor(agoDateRemain / (1000 * 60 * 60))}시간 `;
    }
    autoPrettyString = `${agoDate}일 ${detailString}전`;
  } else {
    if (isMoreDetail === true) {
      detailString = `${Math.floor(agoYearRemain / (1000 * 60 * 60 * 24))}개월`;
    }
    autoPrettyString = `${agoYear}년 ${detailString}전`;
  }

  return {
    diffTime,
    agoSecond,
    agoMinute,
    agoHour,
    agoDate,
    agoYear,
    autoPrettyString,
  };
}

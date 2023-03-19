import { Col, Row, Layout, ConfigProvider } from 'antd';
import React, { useState, useEffect } from 'react';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const StyleDayCurrentMonth = styled.span`
  width: 14%;
  display: inline-block;
`;

const StyleDayNoncurrentMonth = styled.span`
  width: 14%;
  display: inline-block;
  color: gray;
`;

const StyledLayout = styled(Layout)`
  background-color: #ffffff;
`;

function getDates(startDate: Date, endDate: Date): Date[] {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

function findLeapYear(year: number): boolean {
  if (year % 4 === 0) {
    if (year % 100 === 0) {
      if (year % 400 === 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  } else {
    return false;
  }
}

function findDayPosition(
  monthIndex: number,
  year: number,
  leapYear: boolean
): number {
  let index = 0;
  if ([3, 6].includes(monthIndex)) {
    index = 0;
  } else if ([1].includes(monthIndex) && leapYear === false) {
    index = 4;
  } else if ([0].includes(monthIndex) && leapYear === false) {
    index = 1;
  } else if ([8, 11].includes(monthIndex)) {
    index = 6;
  } else if (monthIndex === 10) {
    index = 4;
  } else if (monthIndex === 9) {
    index = 1;
  } else if (monthIndex === 2) {
    index = 4;
  } else if (monthIndex === 7) {
    index = 3;
  } else if (monthIndex === 4) {
    index = 2;
  } else if (monthIndex === 5) {
    index = 5;
  } else if (monthIndex === 0 && leapYear === true) {
    index = 0;
  } else if (monthIndex === 1 && leapYear === true) {
    index = 3;
  }
  let dayIndex =
    ((year % 100) + Math.floor((year % 100) * 0.25) + index + 1 - 1) % 7;
  if (dayIndex === 0) {
    dayIndex = 6;
  } else {
    dayIndex -= 1;
  }
  return dayIndex;
}

const displayCalendar = (
  month: string,
  dates: Date[],
  monthIndex: number
): JSX.Element => {
  return (
    <Col xs={24} sm={12} lg={6}>
      <h3 style={{ right: '8rem' /*margin: "1.5rem", textAlign: "left" */ }}>
        {month}
      </h3>
      <div
        style={{
          padding: '0.5rem',
          minWidth: '100%',
        }}
      >
        <StyleDayNoncurrentMonth>S</StyleDayNoncurrentMonth>
        <StyleDayNoncurrentMonth>M</StyleDayNoncurrentMonth>
        <StyleDayNoncurrentMonth>T</StyleDayNoncurrentMonth>
        <StyleDayNoncurrentMonth>W</StyleDayNoncurrentMonth>
        <StyleDayNoncurrentMonth>T</StyleDayNoncurrentMonth>
        <StyleDayNoncurrentMonth>F</StyleDayNoncurrentMonth>
        <StyleDayNoncurrentMonth>S</StyleDayNoncurrentMonth>
      </div>
      {dates.map((date, index) => {
        if ((index + 1) % 7 === 0) {
          return (
            <div key={index}>
              <div
                style={{
                  padding: '0.5rem',
                  minWidth: '100%',
                }}
              >
                {dates
                  .slice(index - 6, index + 1)
                  .map((subDate, subIndex) =>
                    subDate.getMonth() === monthIndex ? (
                      <StyleDayCurrentMonth key={subIndex}>
                        {subDate.getDate()}
                      </StyleDayCurrentMonth>
                    ) : (
                      <StyleDayNoncurrentMonth key={subIndex}>
                        {subDate.getDate()}
                      </StyleDayNoncurrentMonth>
                    )
                  )}
              </div>
            </div>
          );
        }
        return null;
      })}
    </Col>
  );
};

function createCalendarData(
  monthName: string,
  monthIndex: number,
  year: number
) {
  const month = monthIndex;
  const leapYear = findLeapYear(year);
  const startingDatePosition = findDayPosition(month, year, leapYear);
  const startDate = new Date(`${monthIndex + 1}/01/${year}`);
  startDate.setDate(startDate.getDate() - startingDatePosition);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 41);

  const dates = getDates(startDate, endDate);

  return displayCalendar(monthName, dates, month);
}

export const Calendar = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const [year, setYear] = useState(currentYear);

  const monthData = months.map((month, idx) => {
    return createCalendarData(month, idx, year);
  });

  const incrementYear = () => setYear(year + 1);
  const decrementYear = () => setYear(year - 1);

  return (
    <StyledLayout>
      <div>
        <button onClick={decrementYear}>
          <LeftOutlined />
        </button>
        <span style={{ margin: '20px' }}>{year}</span>
        <button onClick={incrementYear}>
          <RightOutlined />
        </button>
      </div>
      <Row>{monthData}</Row>
    </StyledLayout>
  );
};

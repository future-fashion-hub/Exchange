import React, { useState, useRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker-custom.css";
import { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale/ru";
import styles from "./DatePicker.module.css";
import { Icon } from "../icon/Icon";
import { Button } from "../button/Button";

registerLocale('ru', ru);

interface DatePickerProps {
  selected?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
}

interface CustomHeaderProps {
  date: Date;
  changeYear: (year: number) => void;
  changeMonth: (month: number) => void;
}

const CustomCalendarContainer = ({ 
  children, 
  onCancel, 
  onSelect 
}: { 
  children: React.ReactNode;
  onCancel: () => void;
  onSelect: () => void;
}) => {
  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarContent}>
        {children}
      </div>
      <div className={styles.footerButtons}>
        <Button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
        >
          Отменить
        </Button>
        <Button
          type="button"
          onClick={onSelect}
          colored={true}
          className={styles.selectButton}
        >
          Выбрать
        </Button>
      </div>
    </div>
  );
};

export const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  placeholder = 'дд.мм.гггг',
  label,
  error,
  className,
}) => {
  const [tempDate, setTempDate] = useState<Date | null>(selected || null);
  const datePickerRef = useRef<ReactDatePicker>(null);
  const [isOpen, setIsOpen] = useState(false);

  const renderCustomHeader = ({
    date,
    changeYear,
    changeMonth,
  }: CustomHeaderProps) => (
    <div className={styles.customHeader}>
      <div className={styles.selectors}>
        <select
          value={date.getMonth()}
          onChange={({ target: { value } }) => changeMonth(parseInt(value))}
          className={styles.monthSelector}
        >
          <option value={0}>Январь</option>
          <option value={1}>Февраль</option>
          <option value={2}>Март</option>
          <option value={3}>Апрель</option>
          <option value={4}>Май</option>
          <option value={5}>Июнь</option>
          <option value={6}>Июль</option>
          <option value={7}>Август</option>
          <option value={8}>Сентябрь</option>
          <option value={9}>Октябрь</option>
          <option value={10}>Ноябрь</option>
          <option value={11}>Декабрь</option>
        </select>
        
        <select
          value={date.getFullYear()}
          onChange={({ target: { value } }) => changeYear(parseInt(value))}
          className={styles.yearSelector}
        >
          {Array.from({ length: 100 }, (_, i) => {
            const year = new Date().getFullYear() - 80 + i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );

  const handleToggleCalendar = () => {
    if (isOpen) {
      // Если календарь открыт - закрываем
      if (datePickerRef.current) {
        datePickerRef.current.setOpen(false);
      }
      setIsOpen(false);
    } else {
      // Если календарь закрыт - открываем
      if (datePickerRef.current) {
        datePickerRef.current.setOpen(true);
      }
      setIsOpen(true);
    }
  };

  const CustomInput = ({ value, onClick }: { value?: string; onClick?: () => void }) => (
  <div className={styles.inputContainer}>
    <input
      className={`${styles.input} ${error ? styles.error : ''}`}
      value={value}
      placeholder={placeholder}
      readOnly
      onClick={onClick} // обработчик на инпуте
    />
    <div 
      className={styles.calendarIconWrapper}
      onClick={(e) => {
        e.stopPropagation(); // Предотвращаем всплытие события
        handleToggleCalendar(); // Переключаем состояние календаря
      }}
    >
      <Icon name="calendar" className={styles.calendarIcon} />
    </div>
  </div>
);

  const handleCancel = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(false);
    }
    setIsOpen(false);
  };

  const handleSelect = () => {
    if (tempDate) {
      onChange(tempDate);
    }
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(false);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setTempDate(date);
  };

  const calendarContainer = ({ children }: { children: React.ReactNode }) => (
    <CustomCalendarContainer onCancel={handleCancel} onSelect={handleSelect}>
      {children}
    </CustomCalendarContainer>
  );

  return (
    <div className={`${styles.container} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      
      <ReactDatePicker
        ref={datePickerRef}
        selected={tempDate}
        onChange={handleDateChange}
        customInput={<CustomInput />}
        dateFormat="dd.MM.yyyy"
        renderCustomHeader={renderCustomHeader}
        locale="ru"
        showPopperArrow={false}
        fixedHeight
        isClearable={false}
        onCalendarOpen={() => {
          setTempDate(selected || null);
          setIsOpen(true);
        }}
        onCalendarClose={() => {
          setIsOpen(false);
        }}
        shouldCloseOnSelect={false}
        calendarContainer={calendarContainer}
        popperClassName={styles.popper}
      />
      
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
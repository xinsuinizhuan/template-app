package com.edu.training.converter;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.core.convert.converter.Converter;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 把日期字符串转换为 Date 对象。
 */
@Slf4j
public class DateConverter implements Converter<String, Date> {
    private static final SimpleDateFormat format1 = new SimpleDateFormat("yyyy-MM-dd");
    private static final SimpleDateFormat format2 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private static final SimpleDateFormat format3 = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.S'Z'");

    /**
     * 把日期字符串转换为 Date 对象，接收三种日期格式: yyyy-MM-dd、yyyy-MM-dd HH:mm:ss 或者 yyyy-MM-ddTHH:mm:ss.SZ
     * 如果日期的格式不对，则返回 null。
     *
     * @param source 字符串格式的日期
     * @return 返回日期 Date 的对象，如果日期的格式不对，则返回 null。
     */
    @Override
    public Date convert(String source) {
        if (StringUtils.isBlank(source)) {
            return null;
        }

        SimpleDateFormat format = null;

        switch (source.length()) {
            case 10: format = format1; break;
            case 19: format = format2; break;
            case 24: format = format3; break;
            default: return null;
        }

        try {
            return format.parse(source);
        } catch (ParseException ex) {
            log.warn(ExceptionUtils.getStackTrace(ex));
        }

        return null;
    }
}

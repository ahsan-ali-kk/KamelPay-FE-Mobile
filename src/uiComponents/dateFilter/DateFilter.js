import React, {useState, Fragment, useEffect} from "react";
import {TouchableOpacity, ScrollView} from "react-native";
import {CText, DateRange} from "../../uiComponents";
import {MappedElement} from "../../utils/methods";
import moment from "moment";
import {useTranslation} from "react-i18next";
import Style from "./DateFilter.style";

const todayDate = new Date();
export const dateFilters = (t) => [
    {
        label: t('TRANSACTION_HISTORY.FILTER_LABEL_ONE'),
        key: 'TODAY',
        from: moment(),
        to: moment()
    },
    {
        label: t('TRANSACTION_HISTORY.FILTER_LABEL_TWO'),
        key: 'YESTERDAY',
        from: moment().subtract(1, "days"),
        to: moment().subtract(1, "days")
    },
    {
        label: t('TRANSACTION_HISTORY.FILTER_LABEL_THREE'),
        key: 'LAST_SEVEN_DAYS',
        from: moment(todayDate).day(-5),
        to: moment(),
    },
    {
        label: t('TRANSACTION_HISTORY.FILTER_LABEL_FOUR'),
        key: 'LAST_MONTH',
        // from: moment(),
        from: moment(todayDate).subtract(1, 'month').startOf('month'),
        // to: moment(todayDate).subtract(1, 'month').endOf('month')
        // to: moment(todayDate).subtract(1, 'month').startOf('month')
        to: moment()
    },
    {
        label: t('TRANSACTION_HISTORY.FILTER_LABEL_SIX'),
        key: 'LAST_THIRTY_DAYS',
        from: moment(todayDate).day(-30),
        to: moment()
    },
    {
        label: t('TRANSACTION_HISTORY.FILTER_LABEL_FIVE'),
        key: 'CUSTOM',
    }
];

function DateFilter(props) {

    const { t } = useTranslation();
    const { onChange, initialValue, notInclude, filterArray = [] } = props;
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [isDateRange, setIsDateRange] = useState(false);
    const [dateRange, setDateRange] = useState(null);
    const [initial, updateInitial] = useState(false);

    useEffect(() => {
        if(initial) {
            let dateObj = dateRange ? dateRange : selectedFilter;
            if(dateObj && selectedFilter?.key === 'CUSTOM'){
                dateObj = {
                    ...dateObj,
                    ...selectedFilter
                }
            }
            onChange && onChange(dateObj)
        }
    }, [selectedFilter, dateRange, isDateRange]);

    useEffect(() => {
        updateInitial(true)
    }, []);

    useEffect(() => {
        if(initialValue === 'TODAY') {
            onSelectFilter(filters[0])
        }
    }, [initialValue]);


    const filters = [
        ...(filterArray?.length ? [] : notInclude?.length && notInclude.includes('TODAY') ? [] : [dateFilters(t)[0]]),
        ...(filterArray?.length ? [] : notInclude?.length && notInclude.includes('YESTERDAY') ? [] : [dateFilters(t)[1]]),
        ...(filterArray?.length ? [] : notInclude?.length && notInclude.includes('LAST_SEVEN_DAYS') ? [] : [dateFilters(t)[2]]),
        ...(filterArray?.length ? [] : notInclude?.length && notInclude.includes('LAST_MONTH') ? [] : [dateFilters(t)[3]]),
        ...(filterArray?.length ? [] : notInclude?.length && notInclude.includes('LAST_THIRTY_DAYS') ? [] : [dateFilters(t)[4]]),
        ...(filterArray?.length ? [...filterArray] : []),
        ...(notInclude?.length && notInclude.includes('CUSTOM') ? [] : [dateFilters(t)[5]])
    ];

    const onSelectFilter = (item) => {
        if(selectedFilter?.key !== item?.key) {
            if(item?.key !== 'CUSTOM'){
                setDateRange(null)
            }
            setIsDateRange(item?.key === 'CUSTOM');
            setSelectedFilter(selectedFilter?.key === item?.key ? null : item);
        } else {
            setSelectedFilter(null);
            setDateRange(null);
            setIsDateRange('');
        }
    };

    const onSubmitDateRange = (values) => {
        setDateRange(values);
    };

    const renderFilterItem = (item, index) => {
        return (
            <TouchableOpacity key={index}
                              style={[Style.filterTag, item.key === selectedFilter?.key && Style.activeFilterTag]}
                              onPress={() => onSelectFilter(item)}>
                <CText
                    style={[Style.filterTagText, item.key === selectedFilter?.key && Style.activeFilterTagText]}>
                    {item.label}
                </CText>
            </TouchableOpacity>
        )
    };

    return (
        <Fragment>

            <ScrollView horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={Style.filterContainer}
                        contentContainerStyle={Style.filterScrollContainer}>
                <MappedElement data={filters} renderElement={renderFilterItem}/>
            </ScrollView>

            {isDateRange ? <DateRange
                isClear={dateRange}
                submit={(values) => onSubmitDateRange(values)}/> : null}

        </Fragment>
    )
}

export default React.memo(DateFilter)

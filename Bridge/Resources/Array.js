﻿// @source Array.js

var array = {
    toIndex: function (arr, indices) {
        if (indices.length !== (arr.$s ? arr.$s.length : 1)) {
            throw new System.ArgumentException("Invalid number of indices");
        }

        if (indices[0] < 0 || indices[0] >= (arr.$s ? arr.$s[0] : arr.length)) {
            throw new System.ArgumentException("Index 0 out of range");
        }

        var idx = indices[0],
            i;

        if (arr.$s) {
            for (i = 1; i < arr.$s.length; i++) {
                if (indices[i] < 0 || indices[i] >= arr.$s[i]) {
                    throw new System.ArgumentException("Index " + i + " out of range");
                }

                idx = idx * arr.$s[i] + indices[i];
            }
        }

        return idx;
    },

    $get: function (indices) {
        var r = this[System.Array.toIndex(this, indices)];

        return typeof r !== "undefined" ? r : this.$v;
    },

    get: function (arr) {
        if (arguments.length < 2) {
            throw new System.ArgumentNullException("indices");
        }

        var idx = Array.prototype.slice.call(arguments, 1);

        for (var i = 0; i < idx.length; i++) {
            if (!Bridge.hasValue(idx[i])) {
                throw new System.ArgumentNullException("indices");
            }
        }

        var r = arr[System.Array.toIndex(arr, idx)];

        return typeof r !== "undefined" ? r : arr.$v;
    },

    $set: function (indices, value) {
        this[System.Array.toIndex(this, Array.prototype.slice.call(indices, 0))] = value;
    },

    set: function (arr, value) {
        var indices = Array.prototype.slice.call(arguments, 2);
        arr[System.Array.toIndex(arr, indices)] = value;
    },

    getLength: function (arr, dimension) {
        if (dimension < 0 || dimension >= (arr.$s ? arr.$s.length : 1)) {
            throw new System.IndexOutOfRangeException();
        }

        return arr.$s ? arr.$s[dimension] : arr.length;
    },

    getRank: function (arr) {
        return arr.$s ? arr.$s.length : 1;
    },

    getLower: function (arr, d) {
        System.Array.getLength(arr, d);

        return 0;
    },

    create: function (defvalue, initValues, sizes) {
        var arr = [],
            length = arguments.length > 2 ? 1 : 0,
            i, s, v,
            idx,
            indices,
            flatIdx;

        arr.$v = defvalue;
        arr.$s = [];
        arr.get = System.Array.$get;
        arr.set = System.Array.$set;

        for (i = 2; i < arguments.length; i++) {
            length *= arguments[i];
            arr.$s[i - 2] = arguments[i];
        }

        arr.length = length;

        if (initValues) {
            for (i = 0; i < arr.length; i++) {
                indices = [];
                flatIdx = i;

                for (s = arr.$s.length - 1; s >= 0; s--) {
                    idx = flatIdx % arr.$s[s];
                    indices.unshift(idx);
                    flatIdx = Bridge.Int.div(flatIdx - idx, arr.$s[s]);
                }

                v = initValues;

                for (idx = 0; idx < indices.length; idx++) {
                    v = v[indices[idx]];
                }

                arr[i] = v;
            }
        }

        return arr;
    },

    init: function (size, value) {
        var arr = new Array(size),
            isFn = Bridge.isFunction(value);

        for (var i = 0; i < size; i++) {
            arr[i] = isFn ? value() : value;
        }

        return arr;
    },

    toEnumerable: function (array) {
        return new Bridge.ArrayEnumerable(array);
    },

    toEnumerator: function (array) {
        return new Bridge.ArrayEnumerator(array);
    },

    is: function (obj, type) {
        if (obj instanceof Bridge.ArrayEnumerator) {
            if ((obj.constructor === type) || (obj instanceof type) ||
                type === Bridge.ArrayEnumerator ||
                type.$$name && Bridge.String.startsWith(type.$$name, "System.Collections.IEnumerator") ||
                type.$$name && Bridge.String.startsWith(type.$$name, "System.Collections.Generic.IEnumerator")) {
                return true;
            }

            return false;
        }


        if (!Bridge.isArray(obj)) {
            return false;
        }

        if ((obj.constructor === type) || (obj instanceof type)) {
            return true;
        }

        if (type === System.Collections.IEnumerable ||
            type === System.Collections.ICollection ||
            type === System.ICloneable ||
            type.$$name && Bridge.String.startsWith(type.$$name, "System.Collections.Generic.IEnumerable$1") ||
            type.$$name && Bridge.String.startsWith(type.$$name, "System.Collections.Generic.ICollection$1") ||
            type.$$name && Bridge.String.startsWith(type.$$name, "System.Collections.Generic.IList$1")) {
            return true;
        }

        return false;
    },

    clone: function (arr) {
        if (arr.length === 1) {
            return [arr[0]];
        } else {
            return arr.slice(0);
        }
    },

    getCount: function (obj) {
        if (Bridge.isArray(obj)) {
            return obj.length;
        } else if (Bridge.isFunction(obj.getCount)) {
            return obj.getCount();
        }

        return 0;
    },

    add: function (obj, item) {
        if (Bridge.isArray(obj)) {
            obj.push(item);
        } else if (Bridge.isFunction(obj.add)) {
            obj.add(item);
        }
    },

    clear: function (obj, T) {
        if (Bridge.isArray(obj)) {
            System.Array.fill(obj, T ? (T.getDefaultValue || Bridge.getDefaultValue(T)) : null, 0, obj.length);
        } else if (Bridge.isFunction(obj.clear)) {
            obj.clear();
        }
    },

    fill: function (dst, val, index, count) {
        if (!Bridge.hasValue(dst)) {
            throw new System.ArgumentNullException("dst");
        }

        if (index < 0 || count < 0 || (index + count) > dst.length) {
            throw new System.IndexOutOfRangeException();
        }

        var isFn = Bridge.isFunction(val);

        while (--count >= 0) {
            dst[index + count] = isFn ? val() : val;
        }
    },

    copy: function (src, spos, dst, dpos, len) {
        if (spos < 0 || dpos < 0 || len < 0) {
            throw new System.ArgumentOutOfRangeException();
        }

        if (len > (src.length - spos) || len > (dst.length - dpos)) {
            throw new System.IndexOutOfRangeException();
        }

        if (spos < dpos && src === dst) {
            while (--len >= 0) {
                dst[dpos + len] = src[spos + len];
            }
        } else {
            for (var i = 0; i < len; i++) {
                dst[dpos + i] = src[spos + i];
            }
        }
    },

    indexOf: function (arr, item, startIndex, count) {
        if (Bridge.isArray(arr)) {
            var i,
                el,
                endIndex;

            startIndex = startIndex || 0;
            count = count || arr.length;
            endIndex = startIndex + count;

            for (i = startIndex; i < endIndex; i++) {
                el = arr[i];

                if (el === item || System.Collections.Generic.EqualityComparer$1.$default.equals2(el, item)) {
                    return i;
                }
            }
        } else if (Bridge.isFunction(arr.indexOf)) {
            return arr.indexOf(item);
        }

        return -1;
    },

    contains: function (obj, item) {
        if (Bridge.isArray(obj)) {
            return System.Array.indexOf(obj, item) > -1;
        } else if (Bridge.isFunction(obj.contains)) {
            return obj.contains(item);
        }

        return false;
    },

    remove: function (obj, item) {
        if (Bridge.isArray(obj)) {
            var index = System.Array.indexOf(obj, item);

            if (index > -1) {
                obj.splice(index, 1);

                return true;
            }
        } else if (Bridge.isFunction(obj.remove)) {
            return obj.remove(item);
        }

        return false;
    },

    insert: function (obj, index, item) {
        if (Bridge.isArray(obj)) {
            obj.splice(index, 0, item);
        } else if (Bridge.isFunction(obj.insert)) {
            obj.insert(index, item);
        }
    },

    removeAt: function (obj, index) {
        if (Bridge.isArray(obj)) {
            obj.splice(index, 1);
        } else if (Bridge.isFunction(obj.removeAt)) {
            obj.removeAt(index);
        }
    },

    getItem: function (obj, idx) {
        if (Bridge.isArray(obj)) {
            return obj[idx];
        } else if (Bridge.isFunction(obj.get)) {
            return obj.get(idx);
        } else if (Bridge.isFunction(obj.getItem)) {
            return obj.getItem(idx);
        } else if (Bridge.isFunction(obj.get_Item)) {
            return obj.get_Item(idx);
        }
    },

    setItem: function (obj, idx, value) {
        if (Bridge.isArray(obj)) {
            obj[idx] = value;
        } else if (Bridge.isFunction(obj.set)) {
            obj.set(idx, value);
        } else if (Bridge.isFunction(obj.setItem)) {
            obj.setItem(idx, value);
        } else if (Bridge.isFunction(obj.set_Item)) {
            obj.set_Item(idx, value);
        }
    },

    resize: function (arr, newSize, val) {
        if (newSize < 0) {
            throw new System.ArgumentOutOfRangeException("newSize", null, null, newSize);
        }

        var oldSize = 0,
            isFn = Bridge.isFunction(val),
            ref = arr.v;

        if (!ref) {
            ref = new Array(newSize);
        } else {
            oldSize = ref.length;
            ref.length = newSize;
        }

        for (var i = oldSize; i < newSize; i++) {
            ref[i] = isFn ? val() : val;
        }

        arr.v = ref;
    },

    reverse: function (arr, index, length) {
        if (!array) {
            throw new System.ArgumentNullException("arr");
        }

        if (!index && index !== 0) {
            index = 0;
            length = arr.length;
        }

        if (index < 0 || length < 0) {
            throw new System.ArgumentOutOfRangeException((index < 0 ? "index" : "length"), "Non-negative number required.");
        }

        if ((array.length - index) < length) {
            throw new System.ArgumentException("Offset and length were out of bounds for the array or count is greater than the number of elements from index to the end of the source collection.");
        }

        if (System.Array.getRank(arr) !== 1) {
            throw new System.Exception("Only single dimension arrays are supported here.");
        }

        var i = index,
            j = index + length - 1;

        while (i < j) {
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            i++;
            j--;
        }
    },

    binarySearch: function (array, index, length, value, comparer) {
        if (!array) {
            throw new System.ArgumentNullException("array");
        }

        var lb = 0;

        if (index < lb || length < 0) {
            throw new System.ArgumentOutOfRangeException(index < lb ? "index" : "length", "Non-negative number required.");
        }

        if (array.length - (index - lb) < length) {
            throw new System.ArgumentException("Offset and length were out of bounds for the array or count is greater than the number of elements from index to the end of the source collection.");
        }

        if (System.Array.getRank(array) !== 1) {
            throw new System.RankException("Only single dimensional arrays are supported for the requested action.");
        }

        if (!comparer) {
            comparer = System.Collections.Generic.Comparer$1.$default;
        }

        var lo = index,
            hi = index + length - 1,
            i,
            c;

        while (lo <= hi) {
            i = lo + ((hi - lo) >> 1);

            try {
                c = comparer.compare(array[i], value);
            }
            catch (e) {
                throw new System.InvalidOperationException("Failed to compare two elements in the array.", e);
            }

            if (c === 0) {
                return i;
            }

            if (c < 0) {
                lo = i + 1;
            } else {
                hi = i - 1;
            }
        }

        return ~lo;
    },

    sort: function (array, index, length, comparer) {
        if (!array) {
            throw new System.ArgumentNullException("array");
        }

        if (arguments.length === 2 && typeof index === "object") {
            comparer = index;
            index = null;
        }

        if (!Bridge.isNumber(index)) {
            index = 0;
        }

        if (!Bridge.isNumber(length)) {
            length = array.length;
        }

        if (!comparer) {
            comparer = System.Collections.Generic.Comparer$1.$default;
        }

        if (index === 0 && length === array.length) {
            array.sort(Bridge.fn.bind(comparer, comparer.compare));
        } else {
            var newarray = array.slice(index, index + length);

            newarray.sort(Bridge.fn.bind(comparer, comparer.compare));

            for (var i = index; i < (index + length) ; i++) {
                array[i] = newarray[i - index];
            }
        }
    },

    min: function (arr, minValue) {
        var min = arr[0],
            len = arr.length;

        for (var i = 0; i < len; i++) {
            if ((arr[i] < min || min < minValue) && !(arr[i] < minValue)) {
                min = arr[i];
            }
        }
        return min;
    },

    max: function (arr, maxValue) {
        var max = arr[0],
            len = arr.length;

        for (var i = 0; i < len; i++) {
            if ((arr[i] > max || max > maxValue) && !(arr[i] > maxValue)) {
                max = arr[i];
            }
        }

        return max;
    },

    addRange: function (arr, items) {
        if (Bridge.isArray(items)) {
            arr.push.apply(arr, items);
        } else {
            var e = Bridge.getEnumerator(items);

            try {
                while (e.moveNext()) {
                    arr.push(e.getCurrent());
                }
            }
            finally {
                if (Bridge.is(e, System.IDisposable)) {
                    e.dispose();
                }
            }
        }
    },

    convertAll: function (array, converter) {
        if (!Bridge.hasValue(array)) {
            throw new System.ArgumentNullException("array");
        }

        if (!Bridge.hasValue(converter)) {
            throw new System.ArgumentNullException("converter");
        }

        var array2 = [];

        for (var i = 0; i < array.length; i++) {
            array2[i] = converter(array[i]);
        }

        return array2;
    },

    find: function (T, array, match) {
        if (!Bridge.hasValue(array)) {
            throw new System.ArgumentNullException("array");
        }

        if (!Bridge.hasValue(match)) {
            throw new System.ArgumentNullException("match");
        }

        for (var i = 0; i < array.length; i++) {
            if (match(array[i])) {
                return array[i];
            }
        }

        return Bridge.getDefaultValue(T);
    },

    findAll: function (array, match) {
        if (!Bridge.hasValue(array)) {
            throw new System.ArgumentNullException("array");
        }

        if (!Bridge.hasValue(match)) {
            throw new System.ArgumentNullException("match");
        }

        var list = [];

        for (var i = 0; i < array.length; i++) {
            if (match(array[i])) {
                list.push(array[i]);
            }
        }

        return list;
    },

    findIndex: function (array, startIndex, count, match) {
        if (!Bridge.hasValue(array)) {
            throw new System.ArgumentNullException("array");
        }

        if (arguments.length === 2) {
            match = startIndex;
            startIndex = 0;
            count = array.length;
        } else if (arguments.length === 3) {
            match = count;
            count = array.length - startIndex;
        }

        if (startIndex < 0 || startIndex > array.length) {
            throw new System.ArgumentOutOfRangeException("startIndex");
        }

        if (count < 0 || startIndex > array.length - count) {
            throw new System.ArgumentOutOfRangeException("count");
        }

        if (!Bridge.hasValue(match)) {
            throw new System.ArgumentNullException("match");
        }

        var endIndex = startIndex + count;

        for (var i = startIndex; i < endIndex; i++) {
            if (match(array[i])) {
                return i;
            }
        }

        return -1;
    },

    findLast: function (T, array, match) {
        if (!Bridge.hasValue(array)) {
            throw new System.ArgumentNullException("array");
        }

        if (!Bridge.hasValue(match)) {
            throw new System.ArgumentNullException("match");
        }

        for (var i = array.length - 1; i >= 0; i--) {
            if (match(array[i])) {
                return array[i];
            }
        }

        return Bridge.getDefaultValue(T);
    },

    findLastIndex: function (array, startIndex, count, match) {
        if (!Bridge.hasValue(array)) {
            throw new System.ArgumentNullException("array");
        }

        if (arguments.length === 2) {
            match = startIndex;
            startIndex = array.length - 1;
            count = array.length;
        } else if (arguments.length === 3) {
            match = count;
            count = startIndex + 1;
        }

        if (!Bridge.hasValue(match)) {
            throw new System.ArgumentNullException("match");
        }

        if (array.length === 0) {
            if (startIndex !== -1) {
                throw new System.ArgumentOutOfRangeException("startIndex");
            }
        } else {
            if (startIndex < 0 || startIndex >= array.length) {
                throw new System.ArgumentOutOfRangeException("startIndex");
            }
        }

        if (count < 0 || startIndex - count + 1 < 0) {
            throw new System.ArgumentOutOfRangeException("count");
        }

        var endIndex = startIndex - count;

        for (var i = startIndex; i > endIndex; i--) {
            if (match(array[i])) {
                return i;
            }
        }

        return -1;
    },

    forEach: function (array, action) {
        if (!Bridge.hasValue(array)) {
            throw new System.ArgumentNullException("array");
        }

        if (!Bridge.hasValue(action)) {
            throw new System.ArgumentNullException("action");
        }

        for (var i = 0; i < array.length; i++) {
            action(array[i]);
        }
    },

    indexOfT: function (array, value, startIndex, count) {
        if (!Bridge.hasValue(array)) {
            throw new System.ArgumentNullException("array");
        }

        if (arguments.length === 2) {
            startIndex = 0;
            count = array.length;
        } else if (arguments.length === 3) {
            count = array.length - startIndex;
        }

        if (startIndex < 0 || (startIndex >= array.length && array.length > 0)) {
            throw new System.ArgumentOutOfRangeException("startIndex", "out of range");
        }

        if (count < 0 || count > array.length - startIndex) {
            throw new System.ArgumentOutOfRangeException("count", "out of range");
        }

        return System.Array.indexOf(array, value, startIndex, count);
    },

    lastIndexOfT: function (array, value, startIndex, count) {
        if (!Bridge.hasValue(array)) {
            throw new System.ArgumentNullException("array");
        }

        if (arguments.length === 2) {
            startIndex = array.length - 1;
            count = array.length;
        } else if (arguments.length === 3) {
            count = (array.length === 0) ? 0 : (startIndex + 1);
        }

        if (startIndex < 0 || (startIndex >= array.length && array.length > 0)) {
            throw new System.ArgumentOutOfRangeException("startIndex", "out of range");
        }

        if (count < 0 || startIndex - count + 1 < 0) {
            throw new System.ArgumentOutOfRangeException("count", "out of range");
        }

        var endIndex = startIndex - count + 1;

        for (var i = startIndex; i >= endIndex; i--) {
            var el = array[i];

            if (el === value || System.Collections.Generic.EqualityComparer$1.$default.equals2(el, value)) {
                return i;
            }
        }

        return -1;
    },

    trueForAll: function (array, match) {
        if (!Bridge.hasValue(array)) {
            throw new System.ArgumentNullException("array");
        }

        if (!Bridge.hasValue(match)) {
            throw new System.ArgumentNullException("match");
        }

        for (var i = 0; i < array.length; i++) {
            if (!match(array[i])) {
                return false;
            }
        }

        return true;
    }
};

System.Array = array;

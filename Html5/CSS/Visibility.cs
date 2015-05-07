﻿using Bridge;

namespace Bridge.Html5
{
    /// <summary>
    ///
    /// </summary>
    [Ignore]
    [Enum(Emit.StringNameLowerCase)]
    [Name("String")]
    public enum Visibility
    {
        /// <summary>
        ///
        /// </summary>
        Inherit,

        /// <summary>
        /// Default value, the box is visible.
        /// </summary>
        Visible,

        /// <summary>
        /// The box is invisible (fully transparent, nothing is drawn), but still affects layout.  Descendants of the element will be visible if they have visibility:visible (this doesn't work in IE up to version 7).
        /// </summary>
        Hidden,

        /// <summary>
        /// For table rows, columns, column groups, and row groups the row(s) or column(s) are hidden and the space they would have occupied is removed (as if display: none were applied to the column/row of the table). However, the size of other rows and columns is still calculated as though the cells in the collapsed row(s) or column(s) are present. This was designed for fast removal of a row/column from a table without having to recalculate widths and heights for every portion of the table. For XUL elements, the computed size of the element is always zero, regardless of other styles that would normally affect the size, although margins still take effect. For other elements, collapse is treated the same as hidden.
        /// </summary>
        Collapse
    }
}

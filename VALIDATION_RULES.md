# Invoice Items Modal - Validation Rules

## Conditional Field Requirements by Item Type

### DISCOUNT Item Type
**Mandatory Fields:**
- Unit Price (required)

**Notes:**
- Quantity field is disabled (cannot be edited)
- Other fields are optional
- Displays placeholder "Price (Required)" in Unit Price field

### WORK Item Type
**Mandatory Fields:**
- Type of Work (required)
- Quantity (required)
- Unit Price (required)

**Field Behavior:**
- Company, Model, and Spare fields are disabled
- Type of Work displays placeholder "Type (Required)"
- Quantity and Unit Price show visual error indicators if empty

### SPARE Item Type
**Mandatory Fields:**
- Company (required)
- Model (required)
- Spare (required)
- Quantity (required)
- Unit Price (required)

**Field Behavior:**
- Type of Work field is disabled
- All mandatory fields display "(Required)" in placeholders
- Red error borders appear when fields are empty

## Validation Flow

1. **Item Type Selection** - Always mandatory (red asterisk in header)
2. **Type-Specific Validation** - Based on selected item type code
3. **Error Messages** - Include item type name for clarity:
   - "Please enter type of work for row X (WORK)"
   - "Please select company for row X (SPARE)"
   - "Please enter valid unit price for row X (DISCOUNT)"

## Implementation Details

- Validation occurs in `handleAddItems()` function
- Visual error indicators use `error={condition}` prop on TextField/Autocomplete
- Field disabling prevents invalid data entry
- Tooltips in placeholders guide users on requirements

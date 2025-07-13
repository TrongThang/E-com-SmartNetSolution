# Device Links System - Complete Guide

## Tổng quan hệ thống

Hệ thống Device Links đã được nâng cấp để hỗ trợ:

- **1 hoặc nhiều INPUT** → **1 hoặc nhiều OUTPUT**
- **Thiết bị có thể vừa là INPUT vừa là OUTPUT** tùy theo components configuration
- **Logic operators AND/OR** cho multiple inputs
- **Tự động phân loại thiết bị** theo flow_type trong components

## Kiến trúc hệ thống

### 1. Phân loại thiết bị tự động

```javascript
// Input Device: Có components với flow_type="input"
{
  "current_value": [
    {
      "component_id": "TEMP_001",
      "flow_type": "input",  // ← Đây là input device
      "datatype": "NUMBER",
      "instances": [...]
    }
  ]
}

// Output Device: Có power_status hoặc flow_type="output"
{
  "power_status": false,  // ← Có thể điều khiển bật/tắt
  "current_value": [
    {
      "component_id": "LED_001", 
      "flow_type": "output",  // ← Hoặc có output component
      "instances": [...]
    }
  ]
}
```

### 2. Logic xử lý Multiple Inputs

#### AND Logic (Tất cả điều kiện phải thỏa mãn)
```javascript
// Ví dụ: Hệ thống bảo mật
Input 1: Cảm biến chuyển động = true (AND)
Input 2: Cảm biến cửa mở = true (AND)
→ Kết quả: Cả 2 đều true → Kích hoạt báo động
```

#### OR Logic (Ít nhất 1 điều kiện thỏa mãn)
```javascript
// Ví dụ: Hệ thống tưới
Input 1: Độ ẩm đất < 30% (OR)
Input 2: Nhiệt độ > 35°C (OR)  
→ Kết quả: 1 trong 2 true → Bật máy tưới
```

#### Mixed Logic (AND + OR)
```javascript
// Có thể kết hợp cả AND và OR
Input 1: Nhiệt độ >= 50°C (AND)
Input 2: Độ ẩm < 30% (AND)
Input 3: Cảm biến khói = true (OR)
→ Logic: (Input1 AND Input2) AND (Input3 OR no_OR_conditions)
```

## Các tính năng mới

### 1. Frontend thông minh

#### Phân loại thiết bị tự động
- **Input devices**: Hiển thị icon 📊, chỉ thiết bị có input components
- **Output devices**: Hiển thị icon 🎛️, chỉ thiết bị có thể điều khiển
- **Count hiển thị**: Cho biết có bao nhiêu thiết bị phù hợp

#### Hiển thị grouped theo Output Device
- Group tất cả inputs cùng kích hoạt 1 output
- Hiển thị Logic Summary cho multiple inputs
- Visual indicators cho AND/OR operators

### 2. Backend xử lý phức tạp

#### Service Layer Processing
```typescript
// Xử lý khi device value thay đổi
await processDeviceLinks(deviceId, currentValue)
  ↓
// Group links by output device  
linksByOutput = groupLinksByOutput(inputLinks)
  ↓
// Xử lý từng output device
for each outputDevice:
  await processOutputDeviceLinks(outputDeviceId, links, triggeredDeviceId, currentValue)
    ↓
  // Kiểm tra tất cả input conditions
  conditionResults = checkAllInputConditions(allInputLinks)
    ↓
  // Áp dụng logic operators
  shouldTrigger = evaluateLogicConditions(links, conditionResults)
    ↓
  // Trigger nếu cần
  if shouldTrigger: await triggerOutputDevice(outputLink)
```

#### Logic Evaluation Algorithm
```typescript
function evaluateLogicConditions(links, conditionResults) {
  // Phân loại theo operator
  andLinks = links.filter(l => l.logic_operator === 'AND')
  orLinks = links.filter(l => l.logic_operator === 'OR')
  
  // Evaluate AND: tất cả phải true
  andResult = andLinks.every(link => conditionResults[link.input_device_id] === true)
  
  // Evaluate OR: ít nhất 1 phải true  
  orResult = orLinks.some(link => conditionResults[link.input_device_id] === true)
  
  // Final: (AND conditions) && (OR conditions || no OR)
  return andResult && (orResult || orLinks.length === 0)
}
```

## Use Cases thực tế

### 1. Smart Security System
```javascript
// Tạo multiple links cùng output
POST /api/device-links
[
  {
    "input_device_id": "MOTION_DOOR_001",
    "output_device_id": "SECURITY_ALARM_001", 
    "value_active": "true",
    "logic_operator": "AND"
  },
  {
    "input_device_id": "DOOR_SENSOR_001",
    "output_device_id": "SECURITY_ALARM_001",
    "value_active": "true", 
    "logic_operator": "AND"
  }
]

// Logic: Báo động khi (chuyển động AND cửa mở)
```

### 2. Smart Garden Irrigation
```javascript
// Multiple inputs với OR logic
[
  {
    "input_device_id": "SOIL_HUMIDITY_001",
    "output_device_id": "IRRIGATION_PUMP_001",
    "value_active": "<30",
    "logic_operator": "OR"
  },
  {
    "input_device_id": "AIR_TEMPERATURE_001", 
    "output_device_id": "IRRIGATION_PUMP_001",
    "value_active": ">35",
    "logic_operator": "OR"
  }
]

// Logic: Tưới khi (độ ẩm thấp OR nhiệt độ cao)
```

### 3. Complex HVAC System
```javascript
// Mixed AND/OR logic
[
  {
    "input_device_id": "ROOM_TEMP_001",
    "output_device_id": "AC_UNIT_001",
    "value_active": ">=25",
    "logic_operator": "AND"
  },
  {
    "input_device_id": "HUMIDITY_001",
    "output_device_id": "AC_UNIT_001", 
    "value_active": ">=70",
    "logic_operator": "AND"
  },
  {
    "input_device_id": "MOTION_PRESENCE_001",
    "output_device_id": "AC_UNIT_001",
    "value_active": "true",
    "logic_operator": "OR"
  }
]

// Logic: AC bật khi ((nhiệt độ cao AND độ ẩm cao) AND (có người OR no_OR))
```

## Demo scenarios

### 1. Single Input → Single Output
```
📊 Cảm biến nhiệt độ (≥30°C) → 🎛️ Đèn LED
```

### 2. Multiple Inputs → Single Output (AND)
```
📊 Cảm biến chuyển động (true) AND
📊 Cảm biến cửa (true)
                    ↓
           🎛️ Báo động bảo mật
```

### 3. Multiple Inputs → Single Output (OR)
```
📊 Độ ẩm đất (<30%) OR  
📊 Nhiệt độ (>35°C)
                    ↓
            🎛️ Máy tưới
```

## API Usage

### Tạo liên kết đơn giản
```bash
POST /api/device-links
{
  "input_device_id": "TEMP_001",
  "output_device_id": "FAN_001", 
  "value_active": ">=30",
  "logic_operator": "AND"
}
```

### Tạo multiple liên kết cùng output
```bash
# Link 1
POST /api/device-links
{
  "input_device_id": "MOTION_001",
  "output_device_id": "ALARM_001",
  "value_active": "true", 
  "logic_operator": "AND"
}

# Link 2  
POST /api/device-links
{
  "input_device_id": "DOOR_001",
  "output_device_id": "ALARM_001", 
  "value_active": "true",
  "logic_operator": "AND" 
}
```

### Query grouped links
```bash
GET /api/device-links
# Response sẽ được frontend group theo output device
```

## Frontend Features

### Device Selection Intelligence
- Tự động lọc devices theo capability
- Hiển thị warning nếu không có devices phù hợp
- Icons và labels rõ ràng cho từng loại

### Grouped Display
- Group theo output device
- Hiển thị multiple inputs cho 1 output
- Logic summary cho complex conditions
- Visual flow arrows và badges

### Demo System
- 3 scenarios: single, AND logic, OR logic
- Step-by-step simulation
- Detailed condition evaluation
- Real-time result display

## Best Practices

### 1. Device Design
```javascript
// Good: Device có thể là cả input và output
{
  "name": "Smart Sensor Hub",
  "current_value": [
    {
      "component_id": "TEMP_INPUT",
      "flow_type": "input",    // Đọc nhiệt độ
      "datatype": "NUMBER"
    },
    {
      "component_id": "LED_OUTPUT", 
      "flow_type": "output",   // Điều khiển LED
      "datatype": "BOOLEAN"
    }
  ],
  "power_status": false        // Có thể bật/tắt
}
```

### 2. Logic Design
```javascript
// Good: Logic rõ ràng
AND: Tất cả conditions phải true (strict)
OR: Ít nhất 1 condition true (flexible)

// Bad: Logic phức tạp không cần thiết  
Tránh tạo quá nhiều links cho 1 output
```

### 3. Naming Convention
```javascript
// Good: Tên device mô tả rõ chức năng
"Cảm biến nhiệt độ phòng khách"
"Đèn LED hành lang"  
"Máy tưới khu vườn A"

// Bad: Tên device không rõ nghĩa
"Device 001"
"Sensor"
```

## Monitoring & Debugging

### 1. Backend Logs
```javascript
// Device link triggered logs
console.log(`Device link triggered: ${input_device.name} -> ${output_device.name}`);

// Logic evaluation logs  
console.log(`Logic ${operator}: ${conditions} = ${result}`);
```

### 2. Frontend Debug
```javascript
// Device categorization
console.log('Input devices:', inputDevices.length);
console.log('Output devices:', outputDevices.length);

// Link grouping
console.log('Links by output:', groupedLinks);
```

### 3. Performance Monitoring
```javascript
// Track metrics
- Số lượng device links active
- Tần suất trigger per minute  
- Response time từ trigger đến action
- Success rate của link executions
```

## Troubleshooting

### Common Issues

#### 1. "Không có thiết bị input/output"
**Nguyên nhân**: Device chưa có components với flow_type phù hợp
**Giải pháp**: 
```javascript
// Cần có ít nhất 1 component
{
  "current_value": [
    {
      "flow_type": "input",  // hoặc "output"
      // ... other fields
    }
  ]
}
```

#### 2. "Logic không hoạt động đúng"
**Debug steps**:
1. Check tất cả input conditions
2. Verify logic operators (AND/OR)
3. Test từng link riêng lẻ
4. Check device current_value format

#### 3. "Multiple inputs không trigger"
**Nguyên nhân**: Logic evaluation sai
**Giải pháp**:
```javascript
// AND: TẤT CẢ phải true
condition1 = true, condition2 = false → AND = false

// OR: ÍT NHẤT 1 phải true  
condition1 = true, condition2 = false → OR = true
```

### Performance Issues

#### 1. Quá nhiều links
- **Limit**: Tối đa 10 inputs cho 1 output
- **Solution**: Group logic hợp lý

#### 2. Frequent triggers
- **Problem**: Device update quá nhanh
- **Solution**: Thêm debouncing

```javascript
// Debounce device updates
const debouncedProcessLinks = debounce(processDeviceLinks, 1000);
```

## Future Enhancements

### 1. Advanced Logic
- Support complex expressions: `(A AND B) OR (C AND D)`
- Mathematical operations: `A + B > C`
- Time-based conditions: `between 9AM-5PM`

### 2. Multiple Outputs
- 1 input → nhiều outputs
- Broadcasting scenarios
- Cascade triggers

### 3. Scheduling
- Time-based activations
- Recurring patterns
- Calendar integrations

### 4. Analytics
- Trigger history và patterns
- Performance analytics
- Predictive automation

---

## Kết luận

Hệ thống Device Links đã được nâng cấp hoàn toàn để hỗ trợ:

✅ **Multiple inputs → Multiple outputs**
✅ **AND/OR logic operators** 
✅ **Auto device categorization**
✅ **Smart UI grouping**
✅ **Complex scenario demos**
✅ **Comprehensive monitoring**

**Sẵn sàng cho production** với khả năng mở rộng cao và tính năng automation thông minh! 
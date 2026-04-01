# QR Customization & Download Feature – Implementation Plan (Refined)

## Overview

Enhance the Share QR modal to support:

- QR style customization (pattern + eye style)
- Download options (PNG, SVG)
- Removal of "Copy Link" functionality

---

## ⚠️ Critical Notes (Read Before Implementation)

- DO NOT recreate the QR instance on every render
- Use `qr-code-styling` **instance + update() pattern**
- Ensure **no duplicate canvas/SVG nodes** are appended
- Modal open/close should not leak DOM nodes

---

## Proposed Changes

---

## [MODIFY] ShareQRModal.tsx

### 1. Replace Library

Remove:

- `react-qr-code`

Add:

```bash
pnpm add qr-code-styling
```

---

### 2. State Management

```ts
const [pattern, setPattern] = useState<
  "square" | "dots" | "rounded" | "classy"
>("square");

const [eyeStyle, setEyeStyle] = useState<"square" | "dot" | "extra-rounded">(
  "square",
);
```

---

### 3. Refs Setup

```ts
const qrRef = useRef<HTMLDivElement | null>(null);
const qrInstance = useRef<QRCodeStyling | null>(null);
```

---

### 4. Initialize QR (ONLY ONCE)

```ts
useEffect(() => {
  if (!qrRef.current) return;

  qrInstance.current = new QRCodeStyling({
    width: 280,
    height: 280,
    data: userPageUrl,
    dotsOptions: { type: pattern },
    cornersSquareOptions: { type: eyeStyle },
    backgroundOptions: { color: "#ffffff" },
  });

  qrInstance.current.append(qrRef.current);

  return () => {
    qrRef.current?.replaceChildren(); // cleanup
  };
}, []);
```

---

### 5. Update QR Dynamically

```ts
useEffect(() => {
  if (!qrInstance.current) return;

  qrInstance.current.update({
    data: userPageUrl,
    dotsOptions: { type: pattern },
    cornersSquareOptions: { type: eyeStyle },
  });
}, [pattern, eyeStyle, userPageUrl]);
```

---

### 6. Prevent Duplicate Renders (IMPORTANT)

Before append:

```ts
qrRef.current.innerHTML = "";
```

OR rely on cleanup during unmount.

---

### 7. Download Functions

```ts
const handleDownload = (format: "png" | "svg") => {
  qrInstance.current?.download({
    name: "qr-code",
    extension: format,
  });
};
```

---

### 8. UI Controls

#### Pattern Options

| Label   | Value   |
| ------- | ------- |
| Square  | square  |
| Dots    | dots    |
| Rounded | rounded |
| Classy  | classy  |

#### Eye Style Options

| Label   | Value         |
| ------- | ------------- |
| Square  | square        |
| Circle  | dot           |
| Rounded | extra-rounded |

---

### 9. Remove Copy Feature

DELETE:

- Copy button
- Clipboard logic
- Any tooltip related to copy

---

## [NEW] CustomSelect.tsx

### Requirements

- Lightweight
- Keyboard accessible
- Matches dashboard UI
- Supports:
  - label
  - value
  - onChange
  - options[]

---

### Suggested Props

```ts
type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};
```

---

### Behavior

- Dropdown opens on click
- Closes on outside click
- Highlights selected value
- No heavy libraries (NO react-select)

---

## UI Layout

```
---------------------------------
|        QR Preview              |
|      [Rendered QR]             |
---------------------------------
| Pattern Style   [Select ▼]     |
| Eye Style       [Select ▼]     |
---------------------------------
| [Download PNG] [Download SVG] |
---------------------------------
```

---

## Edge Cases

- Empty `userPageUrl`
  → fallback to homepage or disable download

- Modal reopen
  → ensure QR is not duplicated

- Rapid changes
  → must not freeze UI

- SVG download
  → verify in Chrome + Edge

---

## Performance Considerations

- NEVER recreate QR instance after mount
- Use `.update()` only
- Avoid unnecessary re-renders
- Keep QR size fixed (no layout shift)

---

## Verification Plan

### Manual Testing

1. Open Share QR modal
2. Change pattern → QR updates instantly
3. Change eye style → QR updates instantly
4. Download PNG → file opens correctly
5. Download SVG → scalable + clean
6. Close & reopen modal → no duplicate QR
7. Confirm:
   - ❌ No "Copy Link" button
   - ✅ Only download options present

---

## Acceptance Criteria

- Live QR preview works without lag
- All styles render correctly
- PNG + SVG downloads function
- No DOM duplication issues
- Clean UI aligned with dashboard

---

## Future Improvements (DO NOT IMPLEMENT NOW)

- QR color customization
- Logo embedding
- Save user preferences
- Analytics on QR scans

---

## Final Note

If implementation causes:

- multiple QR renders
- flickering
- memory leaks

→ The issue is **incorrect instance lifecycle handling**

Fix by ensuring:

- single initialization
- controlled updates
- proper cleanup

---

**End of Plan**

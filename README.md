# monitor-scrollbar-width

Detect and monitor the scrollbar width on window resize. Optionally writes a css property with the current width.

## Usage
- Init: ```monitorScrollbar.init();```
- Init with options: ```monitorScrollbar.init({ writeCssProperty: true, cssPropertyName: '--scrollbarWidth',});```
- Destroy: ```monitorScrollbar.destroy();```

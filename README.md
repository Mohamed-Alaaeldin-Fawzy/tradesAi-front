# Trading Application Frontend

This project is the frontend part of a trading platform that allows users to select trading instruments, place orders, It's built using Angular and styled with Tailwind CSS.

## Features

- **Instrument Selection**: Users can browse and select different trading instruments.
- **Order Placement**: Users can place buy or sell orders.
- **Dynamic Loading States**: Provides visual feedback when data is being loaded.
- **Responsive Design**: Fully responsive design using Tailwind CSS.

## Prerequisites

- Node.js
- npm
- Angular CLI

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Mohamed-Alaaeldin-Fawzy/tradesAi-front
   ```
2. Navigate to the project directory:
   ```bash
   cd tradesAi-front
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Run the development server:
   ```bash
   ng serve
   ```
2. Open `http://localhost:4200` in your browser to view the application.

## Built With

- [Angular](https://angular.io/) - The web framework used
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [RxJS](https://rxjs.dev/) - Reactive programming library for handling asynchronous data calls
- [ngx-toastr](https://www.npmjs.com/package/ngx-toastr) - For displaying alerts and messages

## Components

### Instrument List

This component displays a list of tradable instruments and allows users to select an instrument to trade.

### Trade

This component allows users to place orders once an instrument is selected. It includes dynamic form controls to set the order type and quantity.

## Services

### TradeService

Handles all API interactions related to trading activities.

### LoadingService

Manages the UI loading state across the application.

### SelectedInstrumentService

Manages the state of the currently selected instrument in the application.

import { useState } from 'react';

const API_KEY = process.env.REACT_APP_CRUX_API_KEY;
const CHART_WIDTH = 300;
const CHART_HEIGHT = 14;

const CruxDataViewer = ({ cruxData, origin }) => {
  const firstDate = cruxData.record.collectionPeriod.firstDate;
  const lastDate = cruxData.record.collectionPeriod.lastDate;
  const metrics = cruxData.record.metrics;

  return (
    <div>
      <h1>CrUX Data for {origin.split('://')[1]}</h1>
      <h2 style={{ color: '#9ca3af' }}>Period: {firstDate.month}/{firstDate.day}/{firstDate.year} - {lastDate.month}/{lastDate.day}/{lastDate.year}</h2>
      <MetricsViewer metrics={metrics} />
    </div>
  );
};

const MetricsViewer = ({ metrics }) => (
  <div>
    {
      Object.entries(metrics)
        .map(([metricKey, metricValue]) => {
          if (metricKey.includes('experimental_') && Object.keys(metrics).includes(metricKey.replace('experimental_', ''))) return null;

          return [metricKey, metricValue];
        })
        .sort()
        .map((metric) => metric ? (
          <MetricViewer key={metric[0]} metricKey={metric[0]} metricValue={metric[1]} />
        ) : null)}
  </div>
);

const MetricViewer = ({ metricKey, metricValue }) => {
  const goodEnd = metricValue.histogram[0];
  const okEnd = metricValue.histogram[1];
  const poorEnd = metricValue.histogram[2];

  return (
    <div>
      <h3>{metricKey.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h3>
      <DensityViewer label="Good" value={goodEnd.density} color="#22c55e" />
      <DensityViewer label="Ok" value={okEnd.density} color="#f59e0b" />
      <DensityViewer label="Poor" value={poorEnd.density} color="#ef5350" marginBottom="1rem" />
      <MetricChart goodEnd={goodEnd} okEnd={okEnd} poorEnd={poorEnd} />
    </div>
  );
};

const DensityViewer = ({ label, value, color, marginBottom }) => (
  <div style={{ marginBottom }}>
    <span style={{ color: '#9ca3af', fontWeight: 600, marginRight: '0.25rem' }}>{label}:</span>
    <span style={{ color, fontWeight: 600 }}>{(value * 100).toFixed(2)}%</span>
  </div>
);

const MetricChart = ({ goodEnd, okEnd, poorEnd }) => (
  <svg width={CHART_WIDTH} height={CHART_HEIGHT + 4} xmlns="http://www.w3.org/2000/svg">
    <rect x={0} y={2} width={goodEnd.density * CHART_WIDTH} height={CHART_HEIGHT - 2} fill="#22c55e" />
    <rect x={goodEnd.density * CHART_WIDTH} y={2} width={okEnd.density * CHART_WIDTH} height={CHART_HEIGHT - 2} fill="#ffd54f" />
    <rect x={(goodEnd.density + okEnd.density) * CHART_WIDTH} y={2} width={poorEnd.density * CHART_WIDTH} height={CHART_HEIGHT - 2} fill="#ef5350" />
    <rect x={0.75 * CHART_WIDTH} width={2} height={CHART_HEIGHT + 2} fill="#334155" />
  </svg>
);

const fetchCruxData = (origin, formFactor) => {
  return fetch(`https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'origin': origin,
      'formFactor': formFactor,
    }),
  })
    .then((res) => res.json());
};

function App() {
  const [origin, setOrigin] = useState('');
  const [formFactor, setFormFactor] = useState('DESKTOP');
  const [cruxData, setCruxData] = useState(null);

  const handleOriginChange = (e) => setOrigin(e.target.value);
  const handleFormFactorChange = (e) => setFormFactor(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await fetchCruxData(origin, formFactor);
    setCruxData(data);
  };

  if (cruxData?.error) {
    return (
      <div>
        <h1>Error {cruxData.error.code}</h1>
        <p>{cruxData.error.message}</p>
      </div>
    );
  }

  return (
    <div style={{ margin: '2rem 2rem' }}>
      <form style={{ display: 'grid', gap: '20px', alignItems: 'start', justifyContent: 'start' }} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="origin" style={{ color: '#9ca3af', fontWeight: 600, marginRight: '0.25rem' }}>
          Origin:
          </label>
          <input id="origin" type="text" value={origin} onChange={handleOriginChange} />
        </div>
        <div>
          <label htmlFor="form-factor" style={{ color: '#9ca3af', fontWeight: 600, marginRight: '0.25rem' }}>
          Form Factor:
          </label>
          <select id="form-factor" value={formFactor} onChange={handleFormFactorChange}>
            <option value="ALL_FORM_FACTORS">All</option>
            <option value="DESKTOP">Desktop</option>
            <option value="TABLET">Tablet</option>
            <option value="PHONE">Phone</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>

      {cruxData && (
        <CruxDataViewer cruxData={cruxData} origin={origin} />
      )}
    </div>
  );
}

export default App;

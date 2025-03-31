import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Sample data for each card
const cardData = [
  { id: 1, name: "Candidate 1", Quantitative: 20, Technical: 40 },
  { id: 2, name: "Candidate 2", Quantitative: 15, Technical: 25 },
  { id: 3, name: "Candidate 3", Quantitative: 5, Technical: 18 },
  { id: 4, name: "Candidate 4", Quantitative: 12, Technical: 35 },
  { id: 5, name: "Candidate 5", Quantitative: 22, Technical: 42 },
  { id: 6, name: "Candidate 6", Quantitative: 12, Technical: 19 },
];

// Custom color logic for Q/NQ
const getBarColor = (name, value) => {
  if (
    (name === "Quantitative" && value > 10) ||
    (name === "Technical" && value > 20)
  ) {
    return "#588B8B"; // Green for Q
  }
  return "#C8553D"; // Red for NQ
};

// Custom label logic for Q/NQ
const renderCustomizedLabel = (props) => {
  const { x, y, width, value, name } = props;
  const radius = 15;

  const label =
    (name === "Quantitative" && value > 10) ||
    (name === "Technical" && value > 20)
      ? value
      : value;

  return (
    <g>
      <circle cx={x + width / 2} cy={y - radius} r={radius} fill="#8884d8" />
      <text
        x={x + width / 2}
        y={y - radius}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {label}
      </text>
    </g>
  );
};

// Card component that renders chart inside
const CandidateCard = ({ candidate }) => {
  const chartData = [
    { name: "Quantitative", value: candidate.Quantitative },
    { name: "Technical", value: candidate.Technical },
  ];

  return (
    <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
      <div className="card shadow-sm">
        <div className="card-header">{candidate.name}</div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, "dataMax + 10"]} />

              <Tooltip />
              <Bar dataKey="value" barSize={50} minPointSize={10}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry.name, entry.value)}
                  />
                ))}
                <LabelList
                  dataKey="value"
                  position="insideTop"
                  content={(props) =>
                    renderCustomizedLabel({ ...props, name: props.name })
                  }
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Main component that renders all cards
const CandidateStatus = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-secondary">
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="#">
            ADRA
          </a>

          <div className="d-flex">
            <button
              className="btn btn-sm btn-danger"
              type="button"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
          </div>
        </div>
      </nav>

      <div className="container-fluid mt-2">
        <div className="card">
          <div className="card-body">
            <div className="d-flex">
              <h5 className="flex-grow-1">Candidate Aptitute Results</h5>

              <h6>
                Technical <span className="badge text-bg-primary me-2">40</span>                
              </h6>
              
              <h6>
                Quantitative <span className="badge text-bg-primary me-2">20</span>
              </h6>
              <h6>
                Total <span className="badge text-bg-danger">60</span>
              </h6>
            </div>
            <hr/>
            <div className="d-flex">
              <h5 className="flex-grow-1">Cut-off</h5>

              <h6>
                Technical <span className="badge text-bg-secondary me-2">20</span>                
              </h6>
              
              <h6>
                Quantitative <span className="badge text-bg-secondary me-2">10</span>
              </h6>
              <h6>
                Total <span className="badge text-bg-success">30</span>
              </h6>
            </div>
          </div>
        </div>
        <div className="row mt-2">
          {cardData.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CandidateStatus;

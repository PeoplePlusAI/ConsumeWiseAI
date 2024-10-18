function Content({ index, jsonData }) {
    console.log("Generating Content")
    // console.log(typeof(jsonData))
    // console.log(Object.keys(jsonData))
    if (index==="verdict") {
      return <li className="item">{jsonData[index]}</li>;
    }
    if (index==="why") {
        return jsonData[index].map((item) => (
            <li key={item}>{item}</li>
          ))
      }
    if (index==="detailed_analysis") {
        return <li className="item">{jsonData[index]}</li>;
    }
    return <li className="item"></li>;
  }

  export default Content;
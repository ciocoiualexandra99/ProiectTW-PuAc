
const generateResponse = (
  res,
  payload = null,
  statusCode = 400,
  error = null,
  csv = null
) => {
  res.statusCode = statusCode; // Set Status Code
  const responseObject =
    payload !== null
      ? { status: 'OK', payload, csv }
      : { status: 'ERROR', error }; // The object returned, based on success or error

  return res.end(JSON.stringify(responseObject, null, 3));
};

const ReadableStreamToString = (req) =>
  new Promise((resolve, reject) => {
    try {
      let output = '';
      req.on('data', (buffer) => (output += buffer.toString()));
      req.on('end', () => resolve(output));
    } catch (error) {
      reject(error);
    }
  });

const matchRoute = async (req, res, routes) => {
  let url = req.url;

  const route = routes.find(({ method, path }) => {
    if (url.length > 2 && url.slice(-1) === '/') {
      // Check if has '/' at the end and remove it, need to be more than 2 chars on url
      url = url.slice(0, -1);
    }
    const areTheMethodsEqual = method === req.method; // Check if GET === GET etc

    const checkIfPathIsMatching =
      typeof path === 'object' ? url.match(path) : path === url;

    return checkIfPathIsMatching && areTheMethodsEqual; // Return true if is match by path and method, ex: '/users', GET
  });

  if (route) {
    let param = null;
    let body = null;
    const methods = ['POST', 'PATCH', 'PUT'];

    if (typeof route.path === 'object') {
      param = url.match(route.path)[1]; // Get param from request, ex: /users/123 => param: 123 by regex| [1] => the value from regex in on position 1
    }

    if (methods.includes(req.method)) {
      body = await ReadableStreamToString(req);
    }
    return route.callback(res, body, param);
  }
  return generateResponse(res, null, 400, 'ERROR: Bad Request!'); // If not a match return error
};

const cleanString = (str) => str.replace(/\s+/g, ' ').trim();

const mapComments = (
  comments // Map commnets to show them much pretty
) =>
  comments
    .map(
      (comm) =>
        `${comm.name},  ${comm.grade}, ${new Date(
          comm.createdAt
        ).toLocaleDateString()},${comm.comment},`
    )
    .join('; ');

const replacer = (key, value) => {
  // For JSON.stringify fnc, to check what type and value is
  return value == '' || value == null || value == 'undefined'
    ? '-----' // if has no value return this
    : typeof value === 'string'
    ? cleanString(value) // if if a string clean it
    : value; // else just return it
};

  // Map through row and map the values from fields array by value key
const stringFromRow = (fields, row) => {
  return fields
    .map((fieldName) => JSON.stringify(row[fieldName.value], replacer))
    .join(',');
};

const makeAverage = (array = []) => {
  if (!array || array.length < 1) return 0;
  return array.reduce((acc, current) => acc + current, 0) / array.length;
};

const returnCSVFromItems = (objData) => {
  // Set Labels and values to be mapped on the final object
  const fields = [
    {
      label: 'Status',
      value: 'status',
    },
    {
      label: 'Medie Note Comentarii',
      value: 'totalAverageGrade',
    },
    {
      label: 'Total Comentarii Achizitie',
      value: 'totalComments',
    },
    {
      label: 'Total Optiuni',
      value: 'totalOptions',
    },
    {
      label: 'Titlu Achizitie',
      value: 'title',
    },
    {
      label: 'ID Achizitie',
      value: '_id',
    },
    {
      label: 'ID User',
      value: 'userId',
    },
    {
      label: 'Buget Achizitie',
      value: 'budget',
    },
    {
      label: 'Moneda',
      value: 'currency',
    },
    {
      label: 'Descriere Achizitie',
      value: 'description',
    },
    {
      label: 'Categorie Achizitie',
      value: 'category',
    },

    {
      label: 'Pret Optiune',
      value: 'price',
    },
    {
      label: 'Moneda',
      value: 'currency',
    },
    {
      label: 'Link Optiune',
      value: 'link',
    },
    {
      label: 'Descriere Optiune',
      value: 'description',
    },
    {
      label: 'Imagini Optiune',
      value: 'images',
    },
    {
      label: 'Commentarii',
      value: 'comments',
    },
  ];

  // Process the json from DB to clean string, and parse some fields, to add statistics
  const newArr = objData.map((element) => {
    const {
      status,
      createdAt,
      _id,
      userId,
      title,
      budget,
      currency,
      category,
      description,
      options,
    } = element;
    const newOptionsTemp = options.map((option) => {
      const {
        createdAt,
        images,
        _id,
        title,
        price,
        link,
        description,
        currency,
      } = option;
      option.comments = option.comments || [];
      return {
        createdAt,
        images: images.join('; '),
        _id,
        comments: mapComments(option.comments),
        totalAverageGrade: makeAverage(
          option.comments.map((comm) => parseInt(comm.grade))
        ),
        title,
        price,
        link,
        currency,
        description: cleanString(description),
      };
    });
    return {
      status,
      createdAt,
      _id,
      userId,
      title,
      budget,
      currency,
      category,
      description: cleanString(description),
      options: newOptionsTemp,
      totalComments: element.comments.length,
      totalOptions: newOptionsTemp.length,
      totalAverageGrade: makeAverage(element.comments),
      comments: mapComments(element.comments),
    };
  });

  // Create the csv, with the fields labels
  // Join with options for each achizitie
  // For every field that is empty put ----
  const csv = [
    // Fields Labels aka 'Status' 'Title'
    fields.map((row) => row.label).join(','),

    ...newArr.map((row) => {
      return [
        // Normal fields
        stringFromRow(fields, row),
        // Parse options
        ...row.options.map((el) => {
          // Add statistics
          el.totalComments = el.comments.length;

          return stringFromRow(fields, el);
        }),
      ].join('\r\n');
    }),
  ].join('\r\n');

  return csv;
};

module.exports = {
  generateResponse,
  ReadableStreamToString,
  matchRoute,
  returnCSVFromItems,
};

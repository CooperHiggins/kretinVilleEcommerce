getFileName {
    let filename = jsonObj.items;
    filename = filename.map(item => {
        const { title, p } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title };
    }
  }
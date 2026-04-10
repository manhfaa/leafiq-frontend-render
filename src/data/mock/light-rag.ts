import { RagDocument } from "@/types";

export const lightRagDocuments: RagDocument[] = [
  {
    id: "vn-naec-safegro-2025",
    title: "SAFEGRO 2025: Hướng dẫn thực hành sản xuất rau an toàn, bền vững",
    summary:
      "Nguồn tiếng Việt rất phù hợp cho MVP vì sát thực địa, có thể tái bản cho mục đích giáo dục hoặc phi lợi nhuận nếu ghi nguồn.",
    content:
      "Tài liệu SAFEGRO 2025 của Trung tâm Khuyến nông Quốc gia là một điểm neo tốt cho Light RAG nông nghiệp bằng tiếng Việt. Nó phù hợp để ingest dưới dạng PDF hướng dẫn kỹ thuật, đặc biệt khi bạn cần tri thức gần với ngôn ngữ người dùng phổ thông. Khi đóng gói vào RAG, nên giữ metadata về nguồn, điều khoản tái sử dụng và section heading để chunk theo chương mục thay vì cắt thuần theo số token.",
    language: "vi",
    category: "source",
    docType: "guide",
    tags: ["việt nam", "khuyến nông", "naec", "safegro", "rau an toàn", "license", "mvp"],
    source: {
      sourceId: "naec",
      name: "Trung tâm Khuyến nông Quốc gia",
      url: "https://khuyennongvn.gov.vn/DesktopModules/Module/home/UserNewsList_TaiLieu_Download.ashx?url=%2Fdata%2Fdocuments%2F0%2F2025%2F09%2F10%2Fhangweb%2Fe-book-huong-dan-thuc-hanh-san-xuat-rau-an-toan-ben-vung.pdf",
      license: "Tái bản cho mục đích giáo dục hoặc phi lợi nhuận, cần ghi nguồn",
      trustLevel: "official",
    },
  },
  {
    id: "fao-agris-ods",
    title: "FAO AGRIS ODS metadata",
    summary:
      "AGRIS ODS là kho metadata khoa học rất tốt để làm discovery layer, link-out full text và dedup theo DOI hoặc record ID.",
    content:
      "AGRIS ODS của FAO phù hợp cho tầng chỉ mục và phát hiện trùng lặp hơn là dùng như full text gốc. Với hơn hàng chục triệu bản ghi metadata, đây là nguồn tốt để tìm tài liệu theo cây trồng, sâu bệnh, địa lý và ngôn ngữ. Trong ETL, nên ingest theo snapshot zip, lưu checksum và dùng DOI hoặc record ID làm khoá canonical trước khi merge với các repo khác.",
    language: "en",
    category: "source",
    docType: "dataset_metadata",
    tags: ["agris", "fao", "metadata", "doi", "dedup", "bulk", "research"],
    source: {
      sourceId: "fao-agris",
      name: "Food and Agriculture Organization of the United Nations",
      url: "https://www.fao.org/agris/download",
      license: "CC BY 3.0 IGO",
      trustLevel: "official",
    },
  },
  {
    id: "fao-agrovoc",
    title: "AGROVOC cho chuẩn hoá thuật ngữ nông nghiệp",
    summary:
      "AGROVOC nên được dùng để đồng bộ từ vựng cây trồng, sâu bệnh, đầu vào và synonyms Việt–Anh trong toàn KB.",
    content:
      "Một Light RAG nông nghiệp sẽ ổn định hơn nếu có lớp taxonomy chuẩn. AGROVOC cung cấp nhãn đa ngôn ngữ, synonym và định danh khái niệm để map các cách gọi như tên cây trồng, dịch hại, bệnh và đầu vào sản xuất. Trong pipeline, bạn có thể enrich chunk bằng agrovoc_id để hỗ trợ truy vấn song ngữ, giảm lệch thuật ngữ và tăng recall khi người dùng hỏi bằng tên gọi địa phương.",
    language: "en",
    category: "taxonomy",
    docType: "dataset_metadata",
    tags: ["agrovoc", "taxonomy", "synonym", "song ngữ", "chuẩn hóa", "việt anh"],
    source: {
      sourceId: "fao-agrovoc",
      name: "FAO AGROVOC",
      url: "https://aims.fao.org/standards/agrovoc/access-agrovoc",
      license: "CC BY 3.0 IGO",
      trustLevel: "official",
    },
  },
  {
    id: "vn-ppd-license-risk",
    title: "Cục Trồng trọt và Bảo vệ thực vật: rủi ro license khi scrape",
    summary:
      "Portal này rất quan trọng về nội dung nhưng cần thận trọng vì có cảnh báo hạn chế sao chép nếu không có chấp thuận bằng văn bản.",
    content:
      "Với dữ liệu nông nghiệp Việt Nam, portal của Cục Trồng trọt và Bảo vệ thực vật có giá trị vì sát thực địa và liên quan trực tiếp đến cảnh báo sâu bệnh. Tuy nhiên, khi dùng cho RAG thương mại hoặc tái sử dụng quy mô lớn, bạn cần xem kỹ điều khoản vì portal nêu hạn chế sao chép nếu chưa được chấp thuận. Cách an toàn là chỉ lưu metadata, trích đoạn ngắn có ghi nguồn hoặc xin phép bằng văn bản trước khi ingest toàn văn.",
    language: "vi",
    category: "source",
    docType: "portal",
    tags: ["ppd", "bảo vệ thực vật", "license", "pháp lý", "việt nam", "cảnh báo"],
    source: {
      sourceId: "ppd",
      name: "Cục Trồng trọt và Bảo vệ thực vật",
      url: "https://ppd.gov.vn/",
      license: "Cần xem xét chấp thuận bằng văn bản trước khi sao chép quy mô lớn",
      trustLevel: "official",
    },
  },
  {
    id: "vaas-library",
    title: "VAAS library cho sách, sổ tay và tài liệu chuyên sâu",
    summary:
      "VAAS phù hợp để mở rộng chiều sâu tri thức chuyên môn, nhưng nên theo dõi metadata bản quyền theo từng đầu mục.",
    content:
      "Thư viện của Viện Khoa học Nông nghiệp Việt Nam là nguồn tốt để bổ sung các sổ tay, sách và tài liệu chuyên môn cho cây trồng. Trong Light RAG, đây là tầng tri thức sâu hơn khuyến nông phổ thông. Cách ingest phù hợp là tải có kiểm soát, chunk theo cấu trúc chương mục và lưu metadata bản quyền cùng năm xuất bản để dễ kiểm toán về sau.",
    language: "vi",
    category: "source",
    docType: "guide",
    tags: ["vaas", "việt nam", "thư viện", "sổ tay", "sách", "nghiên cứu"],
    source: {
      sourceId: "vaas",
      name: "Viện Khoa học Nông nghiệp Việt Nam",
      url: "https://vaas.vn/vi/library/sach",
      license: "Bản quyền theo tài liệu",
      trustLevel: "research",
    },
  },
  {
    id: "faostat-worldbank",
    title: "FAOSTAT, World Bank và dữ liệu facts",
    summary:
      "Các cổng thống kê nên được dùng để tạo factual snippets có timestamp và địa lý rõ ràng thay vì ingest như văn bản dài.",
    content:
      "FAOSTAT và World Bank phù hợp cho lớp facts theo thời gian, quốc gia và chỉ số kinh tế nông nghiệp. Với Light RAG, không nên coi các bảng số liệu như tài liệu tự do dài, mà nên biến thành các facts dạng câu: chỉ số nào, giai đoạn nào, địa lý nào, đơn vị đo nào. Mỗi fact nên có published_at, retrieved_at và source_version để tránh trả lời mơ hồ.",
    language: "en",
    category: "source",
    docType: "dataset_metadata",
    tags: ["faostat", "world bank", "api", "facts", "thống kê", "chỉ số"],
    source: {
      sourceId: "faostat-worldbank",
      name: "FAOSTAT / World Bank Open Data",
      url: "https://www.fao.org/faostat/en/#developer-portal",
      license: "Theo policy dữ liệu thống kê; World Bank Open Data là CC BY 4.0",
      trustLevel: "official",
    },
  },
  {
    id: "etl-jsonl-schema",
    title: "Schema JSONL cho Light RAG nông nghiệp",
    summary:
      "Chunk JSONL nên có text sạch, loại tài liệu, nguồn, license, thời gian, địa lý và tags nông nghiệp để retrieval ổn định hơn.",
    content:
      "Một record JSONL dùng cho Light RAG nên có id ổn định, text đã sạch HTML, language, doc_type, canonical_url, source, published_at, retrieved_at, geo, agri tags và metadata chất lượng như hash hoặc dup cluster. Nếu làm cho Việt Nam, bạn nên chuẩn hóa địa lý theo mã hành chính, đồng thời giữ trường crops hoặc pests_diseases để chat truy vấn đúng hơn theo bối cảnh.",
    language: "vi",
    category: "etl",
    docType: "playbook",
    tags: ["jsonl", "schema", "etl", "chunk", "metadata", "geo", "quality"],
    source: {
      sourceId: "rag-playbook",
      name: "Leafiq Light RAG Playbook",
      url: "https://khuyennongvn.gov.vn/",
      license: "Nội bộ cho demo frontend",
      trustLevel: "research",
    },
  },
  {
    id: "dedup-normalization",
    title: "Khử trùng lặp và chuẩn hoá cho KB nông nghiệp",
    summary:
      "Dedup nên làm ở 3 tầng: nguồn, tài liệu và chunk; giữ lại bản có license rõ, metadata đủ và ưu tiên tiếng Việt nếu mục tiêu là Việt Nam.",
    content:
      "Với RAG nông nghiệp, duplicate xuất hiện rất nhiều do bài tổng hợp, bản repost và các tài liệu dẫn lại. Ở tầng nguồn, loại các bộ được ghi nhận trùng hẳn. Ở tầng tài liệu, canonicalize URL và ưu tiên DOI hoặc record ID. Ở tầng chunk, dùng hash cho exact duplicate và simhash hoặc minhash cho near duplicate. Chính sách giữ bản tốt nhất nên ưu tiên license rõ, metadata đầy đủ và nội dung tiếng Việt nếu sản phẩm phục vụ nông dân Việt Nam.",
    language: "vi",
    category: "etl",
    docType: "playbook",
    tags: ["dedup", "minhash", "simhash", "canonical url", "metadata", "license", "việt nam"],
    source: {
      sourceId: "rag-playbook",
      name: "Leafiq Light RAG Playbook",
      url: "https://aims.fao.org/standards/agrovoc/access-agrovoc",
      license: "Nội bộ cho demo frontend",
      trustLevel: "research",
    },
  },
  {
    id: "vn-local-open-data",
    title: "Cổng dữ liệu mở địa phương cho nông nghiệp Việt Nam",
    summary:
      "Các cổng CKAN địa phương như Hải Phòng có ích để lấy facts có cấu trúc, nhưng cần ghi rõ trạng thái license của từng dataset.",
    content:
      "Portal dữ liệu mở địa phương là nguồn tốt để bổ sung dữ liệu sản xuất, địa lý và kế hoạch theo huyện, xã hoặc nhóm ngành. Với Light RAG, chúng phù hợp để tạo facts ngắn có cấu trúc hơn là dùng như bài viết dài. Khi ingest, cần lưu dataset URL, ngày cập nhật và giấy phép của từng dataset, vì nhiều cổng mở nhưng chưa ghi rõ open license cho từng file.",
    language: "vi",
    category: "source",
    docType: "dataset_metadata",
    tags: ["ckan", "hải phòng", "open data", "địa phương", "dataset", "việt nam"],
    source: {
      sourceId: "hp-open-data",
      name: "Cổng dữ liệu mở Hải Phòng",
      url: "https://data.haiphong.gov.vn/",
      license: "Theo từng dataset",
      trustLevel: "open-data",
    },
  },
  {
    id: "diagnosis-corn-blight",
    title: "Khuyến nghị cho ca cháy lá phương nam trên ngô",
    summary:
      "Ưu tiên tách khu vực bị hại rõ, giữ tán lá thông thoáng và theo dõi sau mưa hoặc khi độ ẩm tăng cao.",
    content:
      "Với ca bệnh cháy lá phương nam trên ngô, người trồng nên đánh dấu khu vực có vệt dài màu nâu xám, theo dõi mức lan rộng trong 3 đến 5 ngày và giảm điều kiện ẩm kéo dài quanh tán lá. Việc tỉa bớt lá hư hại nặng, vệ sinh đồng ruộng và luân canh sau vụ là các khuyến nghị nền tảng để hạn chế tái phát.",
    language: "vi",
    category: "diagnosis",
    docType: "guide",
    tags: ["ngô", "cháy lá phương nam", "điều trị", "phòng ngừa", "độ ẩm", "triệu chứng"],
    source: {
      sourceId: "leafiq-demo-corn",
      name: "Leafiq Diagnosis Notes",
      url: "https://khuyennongvn.gov.vn/",
      license: "Mock clinical note for demo",
      trustLevel: "research",
    },
  },
  {
    id: "diagnosis-tomato-spot",
    title: "Khuyến nghị cho ca đốm lá sớm trên cà chua",
    summary:
      "Cần giảm tưới lên tán lá, loại bỏ lá bệnh rõ rệt và kiểm tra mặt dưới lá sau các đợt ẩm cao.",
    content:
      "Khi lá cà chua xuất hiện đốm nâu có vòng đồng tâm, nên ưu tiên loại bỏ phần lá bệnh nặng, giữ khoảng cách thông thoáng và tránh tưới phun trực tiếp lên tán lá. Việc theo dõi vùng lá già sau mưa hoặc khi độ ẩm cao là rất quan trọng để xử lý sớm và hạn chế rụng lá hàng loạt.",
    language: "vi",
    category: "diagnosis",
    docType: "guide",
    tags: ["cà chua", "đốm lá sớm", "điều trị", "phòng ngừa", "tưới lá", "độ ẩm"],
    source: {
      sourceId: "leafiq-demo-tomato",
      name: "Leafiq Diagnosis Notes",
      url: "https://vaas.vn/vi/library/sach",
      license: "Mock clinical note for demo",
      trustLevel: "research",
    },
  },
  {
    id: "diagnosis-grape-mildew",
    title: "Khuyến nghị cho ca sương mai trên nho",
    summary:
      "Nên tỉa tán nhẹ, giảm đọng ẩm và kiểm tra lá non vào sáng sớm sau các đợt mưa hoặc sương dài.",
    content:
      "Khi lá nho có vùng vàng dầu và mốc mịn ở mặt dưới, ưu tiên giữ giàn thông thoáng và không để nước đọng kéo dài. Light RAG nên gợi ý hành động rõ ràng theo bối cảnh: kiểm tra lá non đầu vụ, đánh dấu hàng nho có dấu hiệu sớm và theo dõi riêng sau những ngày thời tiết ẩm.",
    language: "vi",
    category: "diagnosis",
    docType: "guide",
    tags: ["nho", "sương mai", "điều trị", "phòng ngừa", "ẩm độ", "giàn nho"],
    source: {
      sourceId: "leafiq-demo-grape",
      name: "Leafiq Diagnosis Notes",
      url: "https://www.knowledgebank.irri.org/",
      license: "Mock clinical note for demo",
      trustLevel: "research",
    },
  },
];
